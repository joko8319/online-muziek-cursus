import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Harde eis migratie: alle URLs eindigen op "/" — zonder dit redirect
  // Next/Vercel /foo/ -> /foo en verhuist elke geïndexeerde URL.
  trailingSlash: true,
  async redirects() {
    // 301's uit de fase 2-checklist ("bewuste opruiming, geen lift-and-shift")
    // + reproductie van de redirect die live al bestaat (gitaarles-voor-beginners).
    const r = (source: string, destination: string) => ({
      source,
      destination,
      statusCode: 301 as const,
    });
    return [
      r("/gitaarles-voor-beginners/", "/gitaarles/"),
      r("/author/boris-vreeswijk/", "/over-ons/"),
      r("/author/mexx-schilder/", "/over-ons/"),
      r("/online-gitaarschool/", "/gitaarles/"),
      r("/gitaarles-online/", "/gitaarles/"),
      // Afbouw gratis-proefles-funnel (beslissing 2026-07-20): weinig gebruikt
      // en de opt-in-backend (Phoenix e-mailmarketing) vervalt bij de cutover.
      r("/keuze-pagina-proefles/", "/cursussen/"),
      r("/gratis-gitaarlessen/", "/gitaarles/"),
      r("/gratis-pianolessen/", "/pianoles/"),
      r("/gratis-zanglessen/", "/zangles/"),
      // Dubbelop met /affiliates/ (beslissing 2026-07-21)
      r("/affiliate-programma/", "/affiliates/"),
      // Oude AMP-variant (WordPress-tijdperk); AMP bestaat niet meer op de site
      r("/gitaarakkoorden/amp/", "/gitaarakkoorden/"),
    ];
  },
};

export default nextConfig;
