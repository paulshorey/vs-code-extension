import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";
import { decodeSfdtToFormattedJson } from "../lib/sfdt";

export async function parseEncodedSfdt(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  try {
    const output = await decodeSfdtToFormattedJson(selectedText);
    await editor.edit((eb) => eb.replace(editor.selection, output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Failed to parse SFDT: ${message}`);
  }
}
