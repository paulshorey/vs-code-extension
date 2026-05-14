import TurndownService from "turndown";

const { gfm } = require("turndown-plugin-gfm") as { gfm: TurndownService.Plugin };

const service = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

service.escape = (text) => text;

type TableCellLike = { nodeName: string; textContent: string | null };
type TableRowLike = { cells: ArrayLike<TableCellLike> };
type TableLike = { rows: ArrayLike<TableRowLike> };

function hasHeadingRow(table: TableLike): boolean {
  const firstRow = table.rows[0];
  return firstRow !== undefined && Array.from(firstRow.cells).every((cell) => cell.nodeName === "TH");
}

service.addRule("underline", {
  filter: ["u", "ins"],
  replacement: (content) => content,
});

service.addRule("strikethrough", {
  filter: ["s", "del", "strike"],
  replacement: (content) => `~~${content}~~`,
});

service.use(gfm);

service.addRule("wordTable", {
  filter: (node) => node.nodeName === "TABLE" && node.rows.length > 0 && !hasHeadingRow(node as unknown as TableLike),
  replacement: (_content, node) => {
    const rows = Array.from((node as unknown as TableLike).rows).map((row) => {
      return Array.from(row.cells).map((cell) => {
        return (cell.textContent ?? "").replace(/\s+/g, " ").trim();
      });
    });

    const columnCount = Math.max(...rows.map((row) => row.length));
    if (columnCount === 0) {
      return "";
    }

    const paddedRows = rows.map((row) => [...row, ...Array(columnCount - row.length).fill("")]);
    const separator = Array.from({ length: columnCount }, () => "---");
    const markdownRows = [paddedRows[0], separator, ...paddedRows.slice(1)];
    return `\n\n${markdownRows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n`;
  },
});

export function htmlToMarkdown(html: string): string {
  return service.turndown(html);
}
