import * as vscode from "vscode";

export function getSelectedText(editor: vscode.TextEditor): string | undefined {
  const text = editor.document.getText(editor.selection);
  if (!text) {
    vscode.window.showWarningMessage("No text selected.");
    return undefined;
  }
  return text;
}

export async function pasteContent(editor: vscode.TextEditor, content: string) {
  await editor.edit((eb) => {
    if (editor.selection.isEmpty) {
      eb.insert(editor.selection.active, content);
    } else {
      eb.replace(editor.selection, content);
    }
  });
}
