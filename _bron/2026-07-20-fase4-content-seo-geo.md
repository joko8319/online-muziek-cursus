# OMC.nl — Fase 4: Content + SEO/GEO verbeteren

_Opgesteld 2026-07-20 · onderdeel van het migratieplan (lift-and-shift)_

> **Gouden regel blijft staan:** URL-structuur is **bevroren**. Fase 4 verbetert wat er *op* de bestaande URLs staat — niet de adressen. Dit is de "beter scoren"-motor van het hele project.

Je voert dit uit **per prioriteitstier zodra de master-sheet uit fase 1 er is** (tier-A eerst — daar zit je verkeer én je omzet, dus je snelste winst). De checklist hieronder kun je nu al klaarleggen.

---

## 4.1 — Content-verbetering (per pagina)

Voor elke cursus-/salespage:

- **Eén heldere zoekintentie** per pagina (bv. "gitaarcursus voor beginners"). Niet drie doelen tegelijk.
- **Answer-first**: de eerste alinea beantwoordt direct de belofte/vraag. Geen lange aanloop.
- **Diepgang die de vraag afdekt**: wat leer je · voor wie · hoe lang · wat heb je nodig · welk resultaat.
- **Uniek en niet dun** — Google én AI negeren dunne of gedupliceerde teksten.
- **Interne links** tussen verwante cursussen (gitaar ↔ ukelele ↔ bas) en naar het cursusoverzicht.
- **Duidelijke CTA** naar de juiste Plug&Pay-checkout — meerdere keren op de pagina.

---

## 4.2 — On-page SEO (per pagina)

- **Title tag:** primair keyword vooraan, merk achteraan, < ~60 tekens.
- **Meta description:** wervend, met keyword, < ~155 tekens (drijft je CTR).
- **H1:** precies één per pagina, bevat het keyword.
- **H2/H3:** logische, scanbare structuur; verwerk vraag-varianten die mensen intypen.
- **Slug/URL:** ongewijzigd (bevroren) — alleen de content eronder verbetert.
- **Afbeeldingen:** alt-tekst, gecomprimeerd, modern formaat (webp).
- **Interne links** met beschrijvende ankertekst (niet "klik hier").
- **Canonical:** self-referencing en correct.

---

## 4.3 — Technische SEO (site-breed)

- **Sitemap.xml** actueel → indienen in Search Console.
- **robots.txt** correct (en let op: staging-noindex moet er ná launch áf).
- **Core Web Vitals:** snelle laadtijd, geen layout shift, mobiel-first. Vercel is snel van zichzelf — benut dat.
- **Structured data (JSON-LD):**
  - `Course` per cursuspagina (naam, beschrijving, aanbieder).
  - `FAQPage` op pagina's met veelgestelde vragen.
  - `BreadcrumbList` voor de navigatiestructuur.
  - `Organization` + `Product`, en `AggregateRating`/`Review` zodra je reviews toont.
- **HTTPS** overal, geen mixed content.

---

## 4.4 — GEO: geciteerd worden door AI-answer-engines (2026)

Waarom apart: mensen zoeken cursussen steeds vaker via **ChatGPT, Perplexity, Google AI Overviews en Gemini**. Die citeren bronnen die **makkelijk te extraheren en betrouwbaar** zijn. Wat je daarvoor doet:

- **Answer-first blokken:** elke belangrijke vraag krijgt bovenaan de sectie een kort, zelfstandig, feitelijk antwoord — precies wat een AI letterlijk kan overnemen.
- **Vraag-antwoord/FAQ-structuur** met FAQ-schema → machine-leesbaar.
- **Feitelijke, extraheerbare claims:** concrete "voor wie", "hoe lang", niveau, wat je nodig hebt — duidelijke feiten i.p.v. vage marketingtaal.
- **Duidelijke entiteiten & consistentie:** noem cursusnamen, instrumenten en je merk overal consequent hetzelfde. Zo bouwt een AI een betrouwbaar beeld van wat OMC is en aanbiedt.
- **E-E-A-T / autoriteit:** docent met ervaring zichtbaar, reviews, "sinds … duizenden cursisten" — vertrouwenssignalen die AI meeweegt bij wie het citeert.
- **Structured data versterkt GEO:** dezelfde schema uit 4.3 helpt AI je content correct interpreteren.
- **`llms.txt` (opkomend):** overweeg een `llms.txt` in de root met een beknopte, machine-vriendelijke gids naar je belangrijkste cursuspagina's.
- **Off-site mentions:** AI-antwoorden leunen op wat het web over je zegt. Consistente vermeldingen elders (reviews, vergelijkingen, gidsen) vergroten je citeerbaarheid. Deels buiten de site, maar goed om mee te nemen.

---

## 4.5 — Conversie (want het doel is méér verkopen)

- **Waardepropositie boven de vouw:** wat, voor wie, belangrijkste voordeel — in één oogopslag.
- **Sociale bewijskracht** (reviews/testimonials) dicht bij de CTA.
- **CTA-knoppen** → juiste Plug&Pay-checkout, opvallend en herhaald.
- **Twijfel wegnemen** vlak vóór de knop: garantie + veelgestelde vragen.
- **Mobiel:** checkout-knop altijd makkelijk bereikbaar.

---

## 4.6 — Meten

- **Search Console:** posities + CTR per pagina/query, vóór vs. na.
- **Analytics:** verkeer + conversies per landingspagina.
- **GEO-check:** test periodiek in ChatGPT / Perplexity / Google AI Overviews of OMC en je cursussen genoemd worden bij relevante vragen (bv. "beste online gitaarcursus", "online leren pianospelen").

---

## Architectuurrichting ná livegang (besproken 2026-07-20)

Beheer/CMS komt pas ná een stabiele cutover (geen herstructurering + rebuild tegelijk). Richting: **headless CMS in het bestaande Next.js-project**, voorkeur **Payload CMS** (admin op `/admin`, eigen collecties voor pagina's/blogposts/categorieën/reacties/leads, Postgres bij Neon/Vercel; alternatief: Sanity gehost). Migratiestrategie: catch-all route kijkt eerst in het CMS en valt terug op het statische fragment — zo kan elke pagina afzonderlijk het CMS in op het moment dat hij in fase 4 tóch wordt herschreven; URLs blijven ongewijzigd. Reacties-met-moderatie, contactformulier en nieuwe leadcapture landen op diezelfde backend.

## Notities uit de fase 2-bouw (2026-07-20)

Tijdens de 1-op-1-herbouw gesignaleerd, bewust níét gefixt (lift-and-shift), hier oppakken:

- **Logo inconsistent en deels onscherp.** Live bestaan twee header-varianten: 110 pagina's gebruiken `online-muzieklessen-1.png` (329×200 px, scherp), ~18 pagina's (o.a. home, `/pianoles/`, `/cursussen/`, legal) gebruiken `Nieuwe-logo-OMC-klein-220x55.png` (220×55 px) — die wordt opgeblazen weergegeven en oogt wazig, zeker op retina. Actie: overal één scherp (retina-)logo.
- **`/akoestische-gitaar/` dubbel in de fase 2-checklist:** zowel "reproduceren" (gedaan) als "301 → `/soorten-gitaren/`" (orphan, 0 vertoningen). De 301 is niet gezet; beslissen bij de consolidatieronde.
- **Dode lightbox-links** in 3 blogposts (`/complete-vocal-technique/`, `/leren-improviseren-voor-zangers/`, `/flageoletten-spelen-op-de-gitaar/`) naar `/wp-content/uploads/2014-2015`-afbeeldingen die live óók al 404 geven. 1-op-1 overgenomen; hier links repareren of verwijderen.
- **17 pagina's hebben live een ander footer-template** zonder "Navigatie"-kolom (o.a. `/muziektheorie/`, `/gitaar-en-aanbidding/`, `/leren-tokkelen/`). Zo gereproduceerd; eventueel gelijktrekken.
- **Popup-ribbons ("inschuivende balk onderaan") verwijderd (beslissing Johan, 2026-07-20).** Alle 5 Phoenix-popups op de site waren gratis-proefles-ribbons; met de funnel weg is het hele popupsysteem (popups.js + config) uit de pipeline gehaald. Bij een nieuwe promo-balk in fase 4: zelf bouwen op de eigen backend.
- **Gratis-proefles-funnel afgebouwd (beslissing Johan, 2026-07-20).** `/keuze-pagina-proefles/` → 301 `/cursussen/`; `/gratis-{gitaar,piano,zang}lessen/` → 301 naar de cursuspagina's; de navigatieknop heet nu "Bekijk alle cursussen!" en linkt direct naar `/cursussen/` (aangepast in `scripts/extract-content.mjs`, zie SKIP_PAGES). **Gevolg: de site heeft geen e-mail-leadcapture meer** — in fase 4 beslissen of daar iets nieuws voor komt. De meta-descriptions van `/muziekles-online/` en `/complete-vocal-technique/` noemen nog "gratis proefles" — meenemen bij de descriptions-ronde.
- **Reacties plaatsen onder blogposts werkt niet meer** (Phoenix-backend, zelfde als contactformulier). De 7 bestaande reacties zijn veiliggesteld en worden statisch geserveerd (`content/comments/`, route `/articles/<uuid>/comments`). In fase 4: eigen reactie-oplossing bouwen óf het reactieformulier verbergen.
- **Inhoudsopgave op blogposts is incompleet — óók live.** De "Inhoudsopgave"-zijbalk (article-layouts `main.js`) toont niet alle koppen van het artikel; dit is een bestaande Phoenix-bug die 1-op-1 is meegekomen. Geen SEO-impact (koppen staan gewoon in de HTML). Bij de fase 4-herinrichting de inhoudsopgave opnieuw opbouwen of weglaten.
- **⚠️ Contactformulier `/contact/` werkt niet op de nieuwe site.** Het is een Phoenix-Vue-component (`form-vue-component` id 6521) die via Phoenix-endpoints (`/form/`, `/submit`) rendert en verstuurt — die backend verdwijnt bij de cutover. Beslissing 2026-07-20: bewust uitgesteld. Plan: eigen formulier + Vercel-API-route + maildienst (Resend of eigen SMTP) naar info@onlinemuziekcursus.nl; honeypot tegen spam. Het is het enige echte formulier op de site (alle 130 pagina's gescand). **Uiterlijk bij fase 5-QA opnieuw bekijken** — na livegang kunnen bezoekers anders geen vraag meer stellen via de site; mail/telefoon staan wel gewoon op de pagina.

---

## Klaar als

Tier-A-pagina's hebben: sterkere content, complete on-page SEO, schema live, answer-first + FAQ voor GEO, en een duidelijke checkout-CTA. **Structuur ongewijzigd.**
