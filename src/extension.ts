import * as vscode from "vscode";
import { handleParseJsonRecursive } from "./commands/parseJsonRecursive";
import { stringifyJson } from "./commands/stringifyJson";
import { parseEncodedSfdt } from "./commands/parseEncodedSfdt";
import { encodeSfdt } from "./commands/encodeSfdt";
import { pasteAsPlainText, pasteAsHtml, pasteAsMarkdown, pasteAsJson, pasteChooseType, pasteJson, pasteDecodedSfdt } from "./commands/pasteClipboardType";
import { pasteWordFileAsMarkdown } from "./commands/pasteWordFileAsMarkdown";
import { convertExplorerWordFileToMarkdown } from "./commands/convertWordFileToMarkdown";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseJsonRecursive", handleParseJsonRecursive),
    vscode.commands.registerTextEditorCommand("ps-json-tools.stringifyJson", stringifyJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseSfdt", parseEncodedSfdt),
    vscode.commands.registerTextEditorCommand("ps-json-tools.encodeSfdt", encodeSfdt),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsPlainText", pasteAsPlainText),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsHtml", pasteAsHtml),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsMarkdown", pasteAsMarkdown),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteWordFileAsMarkdown", pasteWordFileAsMarkdown),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsJson", pasteAsJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteChooseType", pasteChooseType),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteJson", pasteJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteDecodedSfdt", pasteDecodedSfdt),
    vscode.commands.registerCommand("ps-json-tools.convertWordFileToMarkdown", convertExplorerWordFileToMarkdown),
  );
}

export function deactivate() {}
