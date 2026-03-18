import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";
import { parseJsonTextRecursive } from "../lib/json";

export { parseJsonRecursive } from "../lib/json";

export async function handleParseJsonRecursive(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  const deepParsed = parseJsonTextRecursive(selectedText);
  if (deepParsed === undefined) {
    vscode.window.showErrorMessage("Selected text is not valid JSON.");
    return;
  }

  const formatted = JSON.stringify(deepParsed, null, 2);
  await editor.edit((eb) => eb.replace(editor.selection, formatted));
}
