import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";

export async function stringifyJson(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  try {
    const parsed = JSON.parse(selectedText);
    const stringified = JSON.stringify(JSON.stringify(parsed));
    await editor.edit((eb) => eb.replace(editor.selection, stringified));
  } catch {
    const stringified = JSON.stringify(selectedText);
    await editor.edit((eb) => eb.replace(editor.selection, stringified));
  }
}
