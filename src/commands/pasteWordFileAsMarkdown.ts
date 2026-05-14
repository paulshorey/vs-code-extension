import * as path from "node:path";
import * as vscode from "vscode";
import { pasteContent } from "../lib/editor";
import { convertWordFileToMarkdown } from "../lib/wordToMarkdown";

async function chooseWordFile(): Promise<vscode.Uri | undefined> {
  const files = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      "Word documents": ["docx", "doc"],
    },
    openLabel: "Paste as Markdown",
    title: "Paste Word File as Markdown",
  });

  return files?.[0];
}

export async function pasteWordFileAsMarkdown(editor: vscode.TextEditor) {
  const file = await chooseWordFile();
  if (!file) {
    return;
  }

  try {
    const markdown = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Converting ${path.basename(file.fsPath)} to Markdown`,
        cancellable: false,
      },
      async () => {
        return convertWordFileToMarkdown(file.fsPath);
      },
    );

    if (!markdown.markdown) {
      vscode.window.showWarningMessage("The selected Word file did not produce any Markdown content.");
      return;
    }

    await pasteContent(editor, markdown.markdown);

    if (markdown.warnings) {
      vscode.window.showWarningMessage(`Word file pasted with warnings: ${markdown.warnings}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const docNote =
      path.extname(file.fsPath).toLowerCase() === ".doc"
        ? " Mammoth can read OpenXML Word files; legacy binary .doc files may need to be saved as .docx first."
        : "";

    vscode.window.showErrorMessage(`Failed to paste Word file as Markdown: ${message}.${docNote}`);
  }
}
