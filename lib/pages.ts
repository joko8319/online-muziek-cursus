import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type PageMeta = {
  slug: string;
  title: string;
  metadesc: string;
  canonical: string;
  robots: string;
};

// Minimale CSV-parser (RFC 4180: quotes, komma's en newlines in velden).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

let cache: Map<string, PageMeta> | null = null;

// Meta 1-op-1 uit _bron/2026-07-20-pages-index.csv, gekeyed op slug
// (lege slug = homepage, key "home").
export function pagesIndex(): Map<string, PageMeta> {
  if (cache) return cache;
  const csv = readFileSync(join(process.cwd(), "_bron", "2026-07-20-pages-index.csv"), "utf8");
  const [header, ...rows] = parseCsv(csv);
  const col = (name: string) => header.indexOf(name);
  cache = new Map(
    rows.map((r) => {
      const slug = r[col("slug")] || "home";
      return [slug, {
        slug,
        title: r[col("title")],
        metadesc: r[col("metadesc")],
        canonical: r[col("canonical")],
        robots: r[col("robots")],
      }];
    })
  );
  return cache;
}

let liveCache: Record<string, Omit<PageMeta, "slug">> | null = null;

// Fallback voor blogposts: die staan niet in pages-index.csv (blog-index.csv
// bevat alleen Yoast-templates), dus daar geldt de live gerenderde head als
// bron van waarheid — geëxtraheerd naar content/meta-live.json.
function metaLive(): Record<string, Omit<PageMeta, "slug">> {
  if (!liveCache) {
    liveCache = JSON.parse(
      readFileSync(join(process.cwd(), "content", "meta-live.json"), "utf8")
    );
  }
  return liveCache!;
}

export function getPageMeta(slug: string): PageMeta | undefined {
  const fromCsv = pagesIndex().get(slug);
  if (fromCsv) return fromCsv;
  const live = metaLive()[slug];
  return live && { slug, ...live };
}

let assetsCache: Record<string, { css: string[]; js: string[] }> | null = null;

// Per-pagina stylesheets en client-JS (lokale paden), zoals live per
// Phoenix-template verschillend — zie content/page-assets.json.
export function getPageAssets(slug: string): { css: string[]; js: string[] } {
  if (!assetsCache) {
    assetsCache = JSON.parse(
      readFileSync(join(process.cwd(), "content", "page-assets.json"), "utf8")
    );
  }
  return assetsCache![slug] ?? { css: [], js: [] };
}

// Alle slugs waarvoor een contentfragment klaarstaat in content/pages/.
export function builtSlugs(): string[] {
  const dir = join(process.cwd(), "content", "pages");
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""));
}
