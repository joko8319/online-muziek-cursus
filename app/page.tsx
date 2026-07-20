import type { Metadata } from "next";
import { pageHtml } from "@/lib/content";
import { getPageAssets } from "@/lib/pages";

// Meta 1-op-1 uit _bron/2026-07-20-pages-index.csv (rij "/").
export const metadata: Metadata = {
  title: "Online muzieklessen | OnlineMuziekCursus.nl - Muziekschool",
  description:
    "Profiteer met onze online muzieklessen van professioneel lesmateriaal dat je bekijkt wanneer jij wilt. Bestel online muzieklessen en leer op je eigen tempo.",
  robots: "index, follow",
  alternates: { canonical: "https://onlinemuziekcursus.nl/" },
};

export default function Home() {
  const { css, js } = getPageAssets("home");
  return (
    <>
      {css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: pageHtml("home") }} />
      {js.map((src) => (
        <script key={src} defer src={src} />
      ))}
    </>
  );
}
