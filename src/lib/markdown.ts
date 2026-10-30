import { marked } from "marked";

const renderer = new marked.Renderer();
renderer.html = () => "";

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { renderer, async: false }) as string;
}

export function readingMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`\-|]/g, " ")
    .trim();

  if (!plain) return 1;

  const cjk = (plain.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = plain
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}