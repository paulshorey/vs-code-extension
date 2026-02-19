import * as vscode from "vscode";

export function getSelectedText(editor: vscode.TextEditor): string | undefined {
  const text = editor.document.getText(editor.selection);
  if (!text) {
    vscode.window.showWarningMessage("No text selected.");
    return undefined;
  }
  return text;
}
