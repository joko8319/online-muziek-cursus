import { readFileSync } from "node:fs";
import { join } from "node:path";

// Leest het geëxtraheerde Phoenix-bodyfragment (zie scripts/extract-content.mjs).
export function pageHtml(slug: string): string {
  return readFileSync(join(process.cwd(), "content", "pages", `${slug}.html`), "utf8");
}
