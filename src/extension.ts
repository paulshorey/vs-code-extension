import * as vscode from "vscode";
import { handleParseJsonRecursive } from "./commands/parseJsonRecursive";
import { stringifyJson } from "./commands/stringifyJson";
import { parseEncodedSfdt } from "./commands/parseEncodedSfdt";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseJsonRecursive", handleParseJsonRecursive),
    vscode.commands.registerTextEditorCommand("ps-json-tools.stringifyJson", stringifyJson),
    vscode.commands.registerTextEditorCommand("ps-json-tools.parseSfdt", parseEncodedSfdt),
  );
}

export function deactivate() {}
