import * as vscode from "vscode";
import { execFileSync } from "child_process";

function jxa(script: string): string {
  return execFileSync("osascript", ["-l", "JavaScript", "-e", script], {
    encoding: "utf-8",
    timeout: 5000,
    maxBuffer: 50 * 1024 * 1024,
  });
}

function listClipboardTypes(): string[] {
  const script =
    'ObjC.import("AppKit"); JSON.stringify(ObjC.deepUnwrap($.NSPasteboard.generalPasteboard.types));';
  try {
    return JSON.parse(jxa(script).trim());
  } catch {
    return [];
  }
}

function readClipboardType(typeId: string): string | undefined {
  const escaped = typeId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const script = [
    'ObjC.import("AppKit");',
    `var s = $.NSPasteboard.generalPasteboard.stringForType($("${escaped}"));`,
    "ObjC.unwrap(s);",
  ].join(" ");
  try {
    const raw = jxa(script);
    const content = raw.replace(/\n$/, "");
    return content || undefined;
  } catch {
    return undefined;
  }
}

// ── Chromium web-custom-data (Pickle format) parser ──

function readWebCustomDataBase64(): string | undefined {
  const script = [
    'ObjC.import("AppKit"); ObjC.import("Foundation");',
    'var d = $.NSPasteboard.generalPasteboard.dataForType($("org.chromium.web-custom-data"));',
    'd && !d.isNil() ? ObjC.unwrap(d.base64EncodedStringWithOptions(0)) : "";',
  ].join(" ");
  try {
    const b64 = jxa(script).trim();
    return b64 || undefined;
  } catch {
    return undefined;
  }
}

function readPickleString16(buf: Buffer, offset: number): { str: string; next: number } | null {
  if (offset + 4 > buf.length) return null;
  const len = buf.readInt32LE(offset);
  offset += 4;
  const byteLen = len * 2;
  if (offset + byteLen > buf.length) return null;
  const str = buf.subarray(offset, offset + byteLen).toString("utf16le");
  offset += byteLen;
  const pad = offset % 4;
  if (pad !== 0) offset += 4 - pad;
  return { str, next: offset };
}

function parseWebCustomData(buf: Buffer): Map<string, string> {
  const map = new Map<string, string>();
  if (buf.length < 8) return map;
  let offset = 4; // skip pickle header (payload size)
  const count = buf.readUInt32LE(offset);
  offset += 4;
  for (let i = 0; i < count; i++) {
    const key = readPickleString16(buf, offset);
    if (!key) return map;
    offset = key.next;
    const val = readPickleString16(buf, offset);
    if (!val) return map;
    offset = val.next;
    map.set(key.str, val.str);
  }
  return map;
}

function getWebCustomData(): Map<string, string> {
  const b64 = readWebCustomDataBase64();
  if (!b64) return new Map();
  return parseWebCustomData(Buffer.from(b64, "base64"));
}

// ── Public API ──

const MIME_TO_PASTEBOARD: Record<string, string[]> = {
  "text/plain": ["public.utf8-plain-text", "NSStringPboardType"],
  "text/html": ["public.html", "Apple HTML pasteboard type"],
};

function readClipboardAsMime(mimeType: string): string | undefined {
  if (process.platform !== "darwin") {
    vscode.window.showErrorMessage("Paste-by-type is only supported on macOS.");
    return undefined;
  }

  // Try native pasteboard types first
  const candidates = MIME_TO_PASTEBOARD[mimeType];
  if (candidates) {
    for (const id of candidates) {
      const content = readClipboardType(id);
      if (content) return content;
    }
  }

  // Fall back to Chromium's web-custom-data blob
  const customData = getWebCustomData();
  const fromBlob = customData.get(mimeType);
  if (fromBlob) return fromBlob;

  const available = listClipboardTypes();
  const customKeys = [...customData.keys()];
  const allTypes = [...available, ...customKeys.map((k) => `[web-custom-data] ${k}`)];
  vscode.window.showWarningMessage(
    `No "${mimeType}" content on clipboard. Available: ${allTypes.join(", ")}`,
  );
  return undefined;
}

async function pasteContent(editor: vscode.TextEditor, content: string) {
  await editor.edit((eb) => {
    if (editor.selection.isEmpty) {
      eb.insert(editor.selection.active, content);
    } else {
      eb.replace(editor.selection, content);
    }
  });
}

function makePasteCommand(mimeType: string) {
  return async (editor: vscode.TextEditor) => {
    const content = readClipboardAsMime(mimeType);
    if (content === undefined) return;
    await pasteContent(editor, content);
  };
}

export const pasteAsPlainText = makePasteCommand("text/plain");
export const pasteAsHtml = makePasteCommand("text/html");
export const pasteAsJson = makePasteCommand("application/json");

export async function pasteChooseType(editor: vscode.TextEditor) {
  if (process.platform !== "darwin") {
    vscode.window.showErrorMessage("Paste-by-type is only supported on macOS.");
    return;
  }

  const nativeTypes = listClipboardTypes();
  const customData = getWebCustomData();

  const items: vscode.QuickPickItem[] = [];
  for (const t of nativeTypes) {
    if (t === "org.chromium.web-custom-data") continue;
    items.push({ label: t });
  }
  if (customData.size > 0) {
    items.push({ label: "", kind: vscode.QuickPickItemKind.Separator });
    for (const key of customData.keys()) {
      items.push({ label: key, description: "(from web-custom-data)" });
    }
  }

  if (items.length === 0) {
    vscode.window.showWarningMessage("Clipboard is empty.");
    return;
  }

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: "Choose a clipboard content type to paste",
  });
  if (!picked) return;

  const isCustom = customData.has(picked.label);
  const content = isCustom ? customData.get(picked.label) : readClipboardType(picked.label);
  if (!content) {
    vscode.window.showWarningMessage(`No string content for type "${picked.label}".`);
    return;
  }
  await pasteContent(editor, content);
}
