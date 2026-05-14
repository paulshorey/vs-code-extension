import mammoth = require("mammoth");
import { htmlToMarkdown } from "./htmlToMarkdown";

export interface WordToMarkdownResult {
  markdown: string;
  warnings: string;
}

function formatMammothMessages(messages: Array<{ message?: string }>): string {
  return messages.map((message) => message.message).filter(Boolean).join("; ");
}

export async function convertWordFileToMarkdown(filePath: string): Promise<WordToMarkdownResult> {
  const result = await mammoth.convertToHtml({ path: filePath });

  return {
    markdown: htmlToMarkdown(result.value).trim(),
    warnings: formatMammothMessages(result.messages),
  };
}
