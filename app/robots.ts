import type { MetadataRoute } from "next";

// Conform live: alles toegestaan, met verwijzing naar de sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://onlinemuziekcursus.nl/sitemap.xml",
  };
}
