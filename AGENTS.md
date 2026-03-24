# PS JSON Tools — VS Code / Cursor Extension

Right-click context menu tools for transforming selected text.

## Commands

| Command | Description |
|---|---|
| Parse JSON String (Recursive) | Parse JSON, then recursively parse any nested stringified-JSON values |
| Stringify to JSON | Escape and stringify selected text as a JSON string |
| Parse encoded SFDT | Base64-decode + unzip a Syncfusion SFDT blob |
| Paste as text/plain | Paste the `text/plain` content from the clipboard (macOS) |
| Paste as text/html | Paste the `text/html` content from the clipboard (macOS) |
| Paste as application/json | Paste the `application/json` content from the clipboard (macOS) |
| Paste clipboard (choose type) | List all available clipboard types and paste the chosen one (macOS) |
| Paste JSON | Find JSON on clipboard (text/plain or web-custom-data), recursively parse, and paste (macOS) |

## File Structure

```
src/
  extension.ts            # Entry point — registers commands, nothing else
  commands/
    parseJsonRecursive.ts  # "Parse JSON String (Recursive)" handler
    stringifyJson.ts       # "Stringify to JSON" handler
    parseSfdt.ts           # "Parse encoded SFDT" handler
    pasteClipboardType.ts  # Paste clipboard by content type (macOS native pasteboard)
  lib/
    editor.ts              # Shared helpers (getSelectedText)
test/                      # Sample test fixtures
```

## Development

```bash
npm install
npm run watch     # continuous build via esbuild
# Press F5 in VS Code / Cursor to launch the Extension Development Host
npm run build     # production build
npm run package   # produce .vsix
```
