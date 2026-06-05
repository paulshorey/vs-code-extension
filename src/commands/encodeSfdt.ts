import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";
import { encodeJsonToSfdt } from "../lib/sfdt";

export async function encodeSfdt(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  try {
    const output = await encodeJsonToSfdt(selectedText);
    await editor.edit((eb) => eb.replace(editor.selection, output));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Failed to encode SFDT: ${message}`);
  }
}
