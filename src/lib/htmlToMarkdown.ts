import TurndownService from "turndown";

const service = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

service.addRule("underline", {
  filter: ["u", "ins"],
  replacement: (content) => content,
});

service.addRule("strikethrough", {
  filter: ["s", "del", "strike"],
  replacement: (content) => `~~${content}~~`,
});

export function htmlToMarkdown(html: string): string {
  return service.turndown(html);
}
