import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";

/**
 * Treat `text` as the inner content of a JSON string value and unescape it.
 * Handles \", \\, \n, \uXXXX, etc. by wrapping in quotes and letting
 * JSON.parse do the heavy lifting.
 */
function tryUnescapeJsonString(text: string): string | null {
  try {
    const safe = text
      .replace(/\r\n/g, "\\r\\n")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
    const result = JSON.parse('"' + safe + '"');
    return typeof result === "string" ? result : null;
  } catch {
    return null;
  }
}

export function parseJsonRecursive(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      try {
        return parseJsonRecursive(JSON.parse(trimmed));
      } catch {
        if (trimmed.includes("\\")) {
          const unescaped = tryUnescapeJsonString(trimmed);
          if (unescaped !== null) {
            try {
              return parseJsonRecursive(JSON.parse(unescaped));
            } catch {}
          }
        }
        return value;
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => parseJsonRecursive(item));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = parseJsonRecursive(val);
    }
    return result;
  }

  return value;
}

export async function handleParseJsonRecursive(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  const trimmed = selectedText.trim();
  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    if (trimmed.includes("\\")) {
      const unescaped = tryUnescapeJsonString(trimmed);
      if (unescaped !== null) {
        try {
          parsed = JSON.parse(unescaped);
        } catch {}
      }
    }

    if (parsed === undefined) {
      vscode.window.showErrorMessage("Selected text is not valid JSON.");
      return;
    }
  }

  const deepParsed = parseJsonRecursive(parsed);
  const formatted = JSON.stringify(deepParsed, null, 2);
  await editor.edit((eb) => eb.replace(editor.selection, formatted));
}
