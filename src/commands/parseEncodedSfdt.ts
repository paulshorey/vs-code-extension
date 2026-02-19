import * as vscode from "vscode";
import JSZip from "jszip";
import { getSelectedText } from "../lib/editor";

export async function parseEncodedSfdt(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  try {
    let base64String = selectedText.trim();

    const sfdtMatch = base64String.match(/\{\s*"sfdt"\s*:\s*"(.+)"\s*\}/s);
    if (sfdtMatch) {
      base64String = sfdtMatch[1];
    }

    if (base64String.startsWith('"') && base64String.endsWith('"')) {
      base64String = base64String.slice(1, -1);
    }

    const zipBuffer = Buffer.from(base64String, "base64");
    const zip = await JSZip.loadAsync(zipBuffer);
    const fileNames = Object.keys(zip.files).filter((name) => !zip.files[name].dir);

    if (fileNames.length === 0) {
      vscode.window.showErrorMessage("SFDT zip archive contains no files.");
      return;
    }

    const content = await zip.files[fileNames[0]].async("string");

    let output: string;
    try {
      output = JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      output = content;
    }

    await editor.edit((eb) => eb.replace(editor.selection, output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Failed to parse SFDT: ${message}`);
  }
}
