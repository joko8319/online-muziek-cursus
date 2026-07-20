import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageHtml } from "@/lib/content";
import { builtSlugs, getPageAssets, getPageMeta } from "@/lib/pages";

type Props = { params: Promise<{ slug: string[] }> };

// Alleen pagina's met een geëxtraheerd fragment worden gebouwd; de rest 404't.
export const dynamicParams = false;

export function generateStaticParams() {
  return builtSlugs()
    .filter((s) => s !== "home")
    .map((s) => ({ slug: s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = (await params).slug.join("/");
  const meta = getPageMeta(key);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.metadesc || undefined,
    robots: meta.robots,
  };
}

export default async function Page({ params }: Props) {
  const key = (await params).slug.join("/");
  const meta = getPageMeta(key);
  if (!meta) notFound();
  const { css, js } = getPageAssets(key);
  return (
    <>
      {/* Canonical als los element, niet via metadata: trailingSlash: true
          normaliseert metadata-canonicals en zou de uitzondering /gitaarles
          (canonicaliseert live náár de niet-slash-versie) stukmaken. */}
      <link rel="canonical" href={meta.canonical} />
      {/* Stylesheets/JS per pagina — de Phoenix-templates verschillen (o.a.
          /affiliates/ en /contact/ hebben een eigen thema). Volgorde telt:
          defer voert uit in documentvolgorde, jQuery staat vooraan. */}
      {css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: pageHtml(key) }} />
      {js.map((src) =>
        // article-layouts/main.js is een ES-module (blog-artikelopmaak).
        // Bewust GEEN async: React 19 hoist async-scripts naar de head,
        // waardoor het script draait vóórdat #articleData geparsed is.
        // Modules zijn van zichzelf al deferred.
        src.includes("article-layouts") ? (
          <script key={src} type="module" src={src} />
        ) : (
          <script key={src} defer src={src} />
        )
      )}
    </>
  );
}
