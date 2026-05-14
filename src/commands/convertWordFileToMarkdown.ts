import * as path from "node:path";
import * as vscode from "vscode";
import { convertWordFileToMarkdown } from "../lib/wordToMarkdown";

function markdownUriForWordFile(file: vscode.Uri): vscode.Uri {
  const parsed = path.parse(file.fsPath);
  return vscode.Uri.file(path.join(parsed.dir, `${parsed.name}.md`));
}

export async function convertExplorerWordFileToMarkdown(file?: vscode.Uri) {
  if (!file) {
    vscode.window.showWarningMessage("No Word file selected.");
    return;
  }

  if (file.scheme !== "file") {
    vscode.window.showErrorMessage("Convert to .md only supports local files.");
    return;
  }

  if (path.extname(file.fsPath).toLowerCase() !== ".docx") {
    vscode.window.showWarningMessage("Convert to .md currently supports .docx files only.");
    return;
  }

  const output = markdownUriForWordFile(file);

  try {
    const result = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Converting ${path.basename(file.fsPath)} to Markdown`,
        cancellable: false,
      },
      async () => {
        return convertWordFileToMarkdown(file.fsPath);
      },
    );

    if (!result.markdown) {
      vscode.window.showWarningMessage("The selected Word file did not produce any Markdown content.");
      return;
    }

    await vscode.workspace.fs.writeFile(output, Buffer.from(`${result.markdown}\n`, "utf-8"));
    vscode.window.showInformationMessage(`Converted to ${path.basename(output.fsPath)}.`);

    if (result.warnings) {
      vscode.window.showWarningMessage(`Word file converted with warnings: ${result.warnings}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Failed to convert Word file to Markdown: ${message}.`);
  }
}
