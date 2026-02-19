import * as vscode from "vscode";
import { handleParseJsonRecursive } from "./commands/parseJsonRecursive";
import { stringifyJson } from "./commands/stringifyJson";
import { parseEncodedSfdt } from "./commands/parseEncodedSfdt";
import { pasteAsPlainText, pasteAsHtml, pasteAsJson, pasteChooseType, pasteJson } from "./commands/pasteClipboardType";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseJsonRecursive", handleParseJsonRecursive),
    vscode.commands.registerTextEditorCommand("ps-json-tools.stringifyJson", stringifyJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseSfdt", parseEncodedSfdt),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsPlainText", pasteAsPlainText),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsHtml", pasteAsHtml),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteAsJson", pasteAsJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteChooseType", pasteChooseType),
    vscode.commands.registerTextEditorCommand("ps-json-tools.pasteJson", pasteJson),
  );
}

export function deactivate() {}
