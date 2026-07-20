import type { MetadataRoute } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { builtSlugs, getPageMeta } from "@/lib/pages";

// Eén sitemap met alle gereproduceerde pagina's (de live Phoenix-sitemap-index
// minus de URLs die bij ons bewust 301'en). URLs mét trailing slash, conform
// de live sitemap — ook /gitaarles/. lastmod 1-op-1 uit de live sitemaps
// (content/sitemap-lastmod.json).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod: Record<string, string> = JSON.parse(
    readFileSync(join(process.cwd(), "content", "sitemap-lastmod.json"), "utf8")
  );
  return builtSlugs()
    // noindex-pagina's (o.a. de gratis-proefles-funnel) horen niet in de
    // sitemap — conform live
    .filter((slug) => !(getPageMeta(slug)?.robots ?? "").includes("noindex"))
    .map((slug) => (slug === "home" ? "https://onlinemuziekcursus.nl/" : `https://onlinemuziekcursus.nl/${slug}/`))
    .sort()
    .map((url) => ({ url, ...(lastmod[url] ? { lastModified: lastmod[url] } : {}) }));
}
