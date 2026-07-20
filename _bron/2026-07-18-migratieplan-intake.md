# OMC.nl — Migratieplan & Audit-intake
*Opgesteld 18 juli 2026 · Mr Music voor Johan*

## Waar we staan
Stage 0 (strategie & besluit) is rond. Dit ligt vast.

### Besluit
- OnlineMuziekCursus.nl krijgt een **volledig nieuwe website**. Doel: beter scoren op **SEO + GEO** en **meer losse cursussen verkopen**.
- Weg van PhoenixSite (statisch, niks te automatiseren). Nieuwe bouw met Claude Code / eigen stack.

### Scope
**In scope:** OMC.nl — content, sales pages, technische SEO/GEO-fundering, redirect-migratie.

**Bewust uit scope:**
- **Voucher-/betaalflow** — draait volledig los via **Plug&Pay** (checkouts + betaalpagina's; vouchers worden daar automatisch geleverd). De nieuwe site linkt alleen vanuit de knoppen naar die checkout-URLs. De migratie raakt deze flow niet. ✅ Het grootste live-omzet-risico is hiermee van tafel.
- **Gitalis.nl / gitaarles.nl** — [NAAM CHECKEN] topdomein, aparte site, komt hierna als los project. Historisch ~10.000 bezoekers/mnd, gezakt door verwaarlozing.

## Het enige echte migratie-risico: SEO-equity
De site heeft nu bezoekers en verkopen. Elke geïndexeerde URL + ranking + backlink is waarde. De rebuild zelf is makkelijk — **de migratie is waar rankings sneuvelen of overleven.** Deliverable #1 van het hele project = een **1-op-1 redirect-map** (elke oude URL → nieuwe equivalent, 301). Nail dat en we behouden rankings én verbeteren. Sla het over en de verse site zakt maandenlang weg.

## Wat ik van je nodig heb (audit-input)
Drie exports, dan maak ik van het skelet een concreet plan mét redirect-map:
1. **Phoenix-export** — volledige URL-/content-inventaris (de export die je naar WordPress zou uploaden is prima; ik lees 'm uit).
2. **Search Console** — export van *Pagina's* (top-pagina's, laatste 12 mnd) + *Zoekopdrachten* (top queries). Dit vertelt wat rankt en dus beschermd moet worden.
3. **Analytics** — landingspagina-rapport: welke pagina's krijgen echt verkeer en welke converteren naar cursusverkoop.

## Open vragen
1. **Doelstack** — bouwen we OMC custom met Claude Code (five-code / Framer / Next), of wordt het **WordPress**? Je noemde WordPress als upload-doel van de Phoenix-export — is dat de bedoelde eindstack of alleen een data-tussenstap? Dit bepaalt de hele technische aanpak (content-model, SEO-tooling, hosting).
2. **Domeinnaam** — is het overgenomen topdomein **Gitalis.nl** of **gitaarles.nl**? (Vorige keer noemde je Gitalis, nu gitaarles — wil 'm goed hebben.)

## SEO/GEO-fundament (checklist voor de nieuwe bouw)
Zodat de nieuwe site vanaf dag 1 goed staat — voor Google én AI-answer-engines (GEO):

**Technische SEO**
- [ ] Schone, keyword-gerichte URL-structuur (beslissen vóór de redirect-map)
- [ ] 301-redirect-map compleet (oud → nieuw)
- [ ] XML-sitemap + robots.txt
- [ ] Snelle laadtijd / Core Web Vitals
- [ ] Mobiel-first
- [ ] Canonicals, geen duplicate content
- [ ] Search Console + Analytics opnieuw gekoppeld vóór launch

**On-page / content**
- [ ] Keyword-/topic-map specifiek voor OMC (welke cursussen, welke zoekintenties) — bestaat nog niet, moeten we bouwen
- [ ] Eén heldere zoekintentie per pagina
- [ ] Titles + meta descriptions per pagina
- [ ] Interne links tussen cursus-/onderwerp-pagina's

**GEO (AI-answer-engines — 2026)**
- [ ] Structured data / schema (Course, FAQ, Organization, Review)
- [ ] Heldere entiteiten: wie is OMC, welke cursussen, voor wie
- [ ] Citeerbare, feitelijke antwoord-blokken (vraag → kort antwoord) op elke pagina
- [ ] FAQ-secties die echte vragen letterlijk beantwoorden
- [ ] Consistente merkgegevens zodat AI-engines het merk vertrouwen

## Plan-skelet (status)
0. Strategie & besluit — ✅ rond
1. Audit & inventaris — ⏳ wacht op de 3 exports
2. Stack & architectuur — ⏳ wacht op stack-besluit
3. IA + SEO/GEO-fundering + redirect-map
4. Content-migratie + verbetering
5. Bouw (jij code, ik lever copy/SEO/GEO)
6. Pre-launch QA (redirects, checkout-links, analytics, indexatie)
7. Launch + monitoren (Search Console, rankings)
