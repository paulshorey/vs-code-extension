# Project: PS JSON Tools

VS Code/Cursor context-menu tools for JSON, SFDT, clipboard formats, Word-to-Markdown,
and copying selected code as context. Check `package.json` for registered commands.

## Code ownership

`src/extension.ts` registers commands; handlers live in `src/commands/`, shared
editor helpers in `src/lib/`, and sample fixtures in `test/`. Keep UI registration
separate from transformation logic. Clipboard format operations use the macOS pasteboard.

## Development

Use `npm install`, `npm run watch`, and F5 for the Extension Development Host.
Run `npm run typecheck` and `npm run build` for code changes; exercise affected
commands in the editor with representative fixtures. `npm run package` builds,
increments the package version, and creates a VSIX; use it only for a release handoff.

# Research and report

If something went wrong, stop and report back. Include all info, data, and logs.
If unsure about something, research, search the web, find latest techniques and best practices.

# Next steps

Consider what was recently done, what's in progress, and how it contributes to the goal.
Decide and recommend what to do next.

# Goal: Make structured text and clipboard transformations quick and reliable in the editor
