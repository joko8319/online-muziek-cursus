# OMC.nl — Build-pakket (fase 2) — LEES DIT EERST

_2026-07-20 · alles wat je nodig hebt om OnlineMuziekCursus.nl 1-op-1 na te bouwen met vibecode → Vercel._

---

## Wat dit pakket is
De volledige lift-and-shift-bron: elke live-pagina's content + metadata + een afvinkbare checklist, zodat je kunt beginnen met vibecoden zonder nog iets te hoeven opzoeken.

## Mapstructuur
```
omc-migratie/
├── 2026-07-20-BUILD-LEESMIJ.md        ← dit bestand
├── 2026-07-20-migratieplan.md          ← het 7-fasen-plan
├── 2026-07-20-audit-bevindingen.md     ← SEO/verkeer/funnel-analyse
├── 2026-07-20-fase4-content-seo-geo.md ← content/SEO/GEO-verbetering (later)
├── 2026-07-20-fase2-build-checklist.md ← ✅ AFVINKLIJST: 128 URLs te reproduceren
├── 2026-07-20-master-url-sheet.csv     ← alle URLs + verkeer/conversies/tier/acties
├── 2026-07-20-pages-index.csv          ← 75 pages: titel/description/canonical/robots/h1
├── 2026-07-20-blog-index.csv           ← 53 blogposts: titel/Yoast-SEO/categorie
├── 2026-07-20-blog-comments.csv        ← 7 reacties
└── content/
    ├── blog/            53× .html  — kant-en-klare HTML-body per blogpost
    └── pages/
        ├── raw/         75× .html  — volledige live-HTML (bron van waarheid)
        └── txt/         75× .txt   — schone tekst per pagina (om uit te werken)
```

## Waar staat de content per pagina?
- **Blogpost?** → `content/blog/<slug>.html` (schone body, met titel/Yoast-SEO in de comment-header).
- **Pagina (les/cursus/hub/legal/contact)?** → `content/pages/raw/<slug>.html` (volledig) + `content/pages/txt/<slug>.txt` (leesbaar). De les-pagina's zijn volwaardige sales-templates (~1.400-1.700 woorden, ~28 koppen) — de `raw/` HTML is je referentie voor de structuur.
- **Meta-titel & description** per pagina staan in `pages-index.csv` / `blog-index.csv` → 1-op-1 overnemen (of verbeteren in fase 4).

---

## ⚠️ Harde technische eisen (hier valt of staat de migratie)

1. **`trailingSlash: true`** — ALLE 125+ URLs eindigen op `/`. Zet dit in `next.config.js` (`module.exports = { trailingSlash: true }`) of de vibecode-equivalent. Zonder dit redirect Vercel/Next `/foo/` → `/foo` en verhuist élke geïndexeerde URL → rankingverlies. **Non-negotiable.**
2. **Canonical mét slash**, met één uitzondering: **`/gitaarles`** canonicaliseert live náár de niet-slash-versie — neem dat 1-op-1 zo over (pas evt. later normaliseren).
3. **`robots: index, follow`** op alle content-pagina's (de oude `noindex=1` in de blog-export is dood — negeren).
4. **https + kleine letters + geen `.html`** — de huidige conventie; niets aan veranderen.
5. **Checkout-knoppen** → linken naar de bestaande **Plug&Pay** `/checkout/…`-URLs (staan in `master-url-sheet.csv`, rijen met notitie "Plug&Pay off-site").

## Tracking meenemen (anders breekt meting)
- **Google Tag Manager** `GTM-KQXJ3F6` + **Google Ads** `AW-1005401286` opnieuw plaatsen.
- Nieuwe site **verifiëren in Search Console** + sitemap indienen (fase 6-7).

## Media (beslissing nodig)
Afbeeldingen draaien nu op `media-01.imu.nl` / `cdn.phoenixsite.nl`. Advies: **downloaden en zelf hosten** op Vercel — je verlaat Phoenix, dus wil je niet afhankelijk blijven van hun CDN. Alle image-URLs zitten in de `content/pages/raw/`-HTML → makkelijk te verzamelen.

---

## Bouwvolgorde (uit de audit)
Reproduceer álles, maar begin met wat telt:
1. **Commerciële motor** (converteert): `basgitaarles`, `gitaarles`, `zangles`, `ukelele-les`, `dirigeren`, `cursussen`, `drumles`, `pianoles`.
2. **Quick-wins** (veel vertoningen, pagina 2): `zangles`, `noten-en-akkoorden-op-de-gitaar`, `basgitaarles`, `ukelele-les`, `online-piano-leren-spelen`, `simpele-popliedjes-…-zang`, de akkoord-pagina's.
3. De rest (info/blog/legal/systeem).

## ❌ Niet doen tijdens de bouw
- **Geen URL-structuur "opschonen".** Alle bijna-dubbele les-URLs (de kannibalisatie-clusters) gewoon 1-op-1 reproduceren. Consolideren = **fase 4**, ná een stabiele livegang, mét 301's.
- **Niet herstructureren + rebuilden tegelijk** — dat is precies hoe rankings sneuvelen.

## Daarna
- **Fase 3** — URL-identiteit verifiëren (elke URL 200 op identiek pad) → `migratieplan.md`.
- **Fase 5** — QA (checkout-links, tracking, 404-check).
- **Fase 6** — DNS-cutover naar Vercel (TTL laag, SSL klaar, Phoenix laten staan).
- **Fase 7** — Search Console monitoren, ~4-6 weken.

Start bij **`2026-07-20-fase2-build-checklist.md`** en vink af. 🎸
