import * as vscode from "vscode";
import { getSelectedText } from "../lib/editor";

export async function copyAsContext(editor: vscode.TextEditor) {
  const selectedText = getSelectedText(editor);
  if (!selectedText) {
    return;
  }

  const filePath = vscode.workspace.asRelativePath(editor.document.uri, false);
  const startLine = editor.selection.start.line + 1;
  const context = `${filePath}\nline ${startLine}\n\`\`\`\n${selectedText}\n\`\`\``;

  await vscode.env.clipboard.writeText(context);
  vscode.window.showInformationMessage("Copied selection as context.");
}
