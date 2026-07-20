# OMC.nl — Migratieplan (lift-and-shift)

_Opgesteld 2026-07-20 · van PhoenixSite → vibecode-bouw op Vercel_

---

## Uitgangspunten (vastgelegd — stage 0 ✅)

- **Doel:** frisse, beter beheerbare site → beter scoren op **SEO + GEO** en **meer losse cursussen verkopen**.
- **Aanpak:** **lift-and-shift**. Elke URL 1-op-1 nabouwen, alleen DNS omzetten naar Vercel. → **Geen bulk-redirects**; de "redirect-map" wordt een **verificatie-checklist**.
- **Stack:** bouwen door te **vibecoden** (met Claude Code), hosten op **Vercel**.
- **Buiten scope:** voucher-/betaalflow draait los via **Plug&Pay** — de nieuwe site linkt alleen vanuit de knoppen naar die checkout-URLs. Geen live omzet die kan breken bij de migratie.
- **Gitaarles.nl:** los project, later, aparte site.
- **Gouden regel:** URL-structuur bevriezen. Rebuild **en** herstructureren tegelijk = de manier waarop mensen rankings verliezen. Eerst 1-op-1 (nul risico), content verbeteren mag; structuur pas later, per URL, met een 301 op dát moment.

---

## Fase 1 — Audit & inventaris  _(jouw input start dit)_

**Doel:** één master-overzicht van alles wat de site nu is en waard is.

Input die je aanlevert:
1. **Phoenix-export** — volledige URL-/content-inventaris.
2. **Search Console** — export *Pagina's* (top-pagina's, 12 mnd) + *Zoekopdrachten* (top queries).
3. **Analytics** — landingspagina-rapport: welke pagina's krijgen verkeer, welke converteren.

Ik lever terug: een **master-URL-sheet** met per URL → huidig verkeer · top-queries · converteert (ja/nee) · **prioriteitstier** (A = verkeer+omzet, B = verkeer, C = rest). Die tiering bepaalt wat we het scherpst controleren bij de cutover.

**Klaar als:** elke bestaande URL staat in de sheet, met tier.

---

## Fase 2 — Bouw 1-op-1 (vibecode → Vercel)  _(staging)_

- Elke pagina nabouwen op **exact hetzelfde pad**.
- Bouwen op een **staging-/preview-URL**, op **noindex** of achter wachtwoord — zodat Google die tijdelijke versie niet indexeert.
- **SSL/https op Vercel klaarzetten** vóór de flip.
- Checkout-knoppen wijzen naar de bestaande **Plug&Pay** checkout-URLs (1-op-1 overnemen uit de oude site).

**Klaar als:** hele site staat op staging, elke pagina bestaat, noindex actief.

---

## Fase 3 — URL-identiteit verifiëren  _(dit vervangt de redirect-map)_

Loop de master-sheet af en check per URL of de nieuwe site op **exact hetzelfde adres** een **200** teruggeeft. "Exact hetzelfde" is detailwerk — dit is waar een lift-and-shift stiekem misgaat:

- **Trailing slash — DIT is bij OMC hét risico.** Uit de URL-export blijkt: **alle 125 URLs eindigen op een `/`** (100% consistent). Vercel/Next.js zetten standaard `trailingSlash: false` en **redirecten `/foo/` → `/foo`** — dat zou élke geïndexeerde URL naar een nieuw adres sturen. In de vibecode-bouw dus **`trailingSlash: true`** afdwingen zodat elke `/…/`-URL een directe 200 geeft. Non-negotiable.
- **Bestandsextensies** — ✅ geen risico hier: de export bevat **0** `.html`-URLs; allemaal schone slugs. (Wel blijven checken dat de nieuwe bouw ze niet alsnog als `/pagina.html` serveert.)
- **www vs zonder www**, en **https** — moeten identiek blijven.
- **Hoofd-/kleine letters**.
- **Accenttekens / URL-encoding** (relevant bij NL-slugs).
- **Afbeeldings- en mediapaden** — backlinks en Google Afbeeldingen wijzen naar bestandspaden; laat die net zo staan.

**Live-audit 2026-07-20 (huidige Phoenix-site):**
- ✅ **Trailing-slash-conventie bevestigd** — canonicals van 9/10 gecheckte paginatypes wijzen mét slash. **Uitzondering: `/gitaarles`** canonicaliseert naar de niet-slash-versie (`…/gitaarles`) → 1-op-1 zo overnemen, pas later evt. normaliseren.
- ✅ **noindex is géén probleem** — élke gecheckte pagina serveert live `robots: index, follow`. De `noindex=1` in de oude blog-export is dode legacy-metadata die Phoenix negeert.
- ℹ️ **Tracking staat live**: Google Tag Manager (`GTM-KQXJ3F6`) + Google Ads (`AW-1005401286`) → meenemen in fase 5 (QA).
- ℹ️ **Media** draait op `media-01.imu.nl` / `cdn.phoenixsite.nl` → beslissen: paden behouden of re-hosten.

Het handjevol URLs dat je écht niet identiek krijgt → **301** naar de nieuwe variant. Dat zijn er weinig; de rest is gewoon 200-op-hetzelfde-adres.

**Klaar als:** elke tier-A/B-URL geeft 200 op identiek pad (of een bewuste 301), afgevinkt in de sheet.

---

## Fase 4 — Content + SEO/GEO verbeteren  _(op bestaande URLs)_

Uitgewerkt in een apart doc: **`2026-07-20-fase4-content-seo-geo.md`**. Kern: content mag beter, **structuur blijft bevroren**. On-page SEO + technische SEO + GEO (geciteerd worden door AI-answer-engines) + conversie naar de Plug&Pay-checkout.

**Prioriteit uit de audit** (zie `2026-07-20-audit-bevindingen.md`): (1) de **quick-win-pagina's** — veel vertoningen op positie 5-15, pagina 2 → pagina 1; (2) de **commerciële motor** (basgitaarles, gitaarles, zangles, ukelele-les, dirigeren, cursussen). En de grote structurele SEO-winst: **consolideer de kannibalisatie-clusters** ("online gitaarles" ×6, "online pianoles" ×6) tot één sterke URL per cluster + 301's — bewust hier, ná de 1-op-1 migratie.

**Klaar als:** tier-A-pagina's zijn inhoudelijk sterker dan de oude, structuur ongewijzigd.

---

## Fase 5 — Pre-launch QA

- **Alle checkout-links** getest → openen de juiste Plug&Pay-pagina (`/checkout/…` = off-site, klopt), cursus/voucher komt door.
- **`/betaling-succesvol…`-pagina's NIET migreren** — oude bedankpagina's, niet meer in gebruik; de bedank-/conversieflow zit nu volledig in Plug&Pay (correctie Johan 2026-07-20). Conversiemeting loopt dus off-site → evt. later een outbound-click-event op de checkout-knoppen (fase 4) om paginabijdrage te blijven zien.
- **Analytics + Search Console-tracking** geïnstalleerd op de nieuwe site (o.a. GTM `GTM-KQXJ3F6`).
- **404-check** — geen dode links/media.
- Staging staat **nog steeds op noindex** tot de flip.

**Klaar als:** volledige doorloop zonder fouten, checkout bewezen werkend.

---

## Fase 6 — DNS-cutover

1. **DNS-TTL verlagen** een dag van tevoren (snellere propagatie/terugval).
2. **SSL op Vercel** bevestigd actief.
3. **Phoenix-site laten staan** tijdens de propagatie (paar uur tot een dag) — niemand landt op een gat.
4. **DNS omzetten** naar Vercel.
5. **noindex eraf** / nieuwe site indexeerbaar maken zodra live.

**Klaar als:** domein serveert de Vercel-site, https werkt, site is indexeerbaar.

---

## Fase 7 — Launch + monitoren

- Nieuwe site **verifiëren in Search Console**, (ongewijzigde) **sitemap indienen**.
- **Dekking/indexatie** en **rankings** volgen, ~4–6 weken.
- Opduikende **404's** direct opvangen met een 301.

**Klaar als:** dekking stabiel, geen ranking-daling, restfoutjes weggewerkt.

---

## Niet doen (de valkuilen)

- ❌ Rebuild + URL-structuur "mooier maken" in één klap.
- ❌ Staging indexeerbaar laten staan (dubbele content).
- ❌ Live gaan zonder de URL-identiteit-check van fase 3.
- ❌ Phoenix meteen afbreken bij de flip — laat 'm even staan.

---

## Directe volgende stap

**Fase 1 start bij jouw drie exports** (Phoenix + Search Console + Analytics). Heb je alles → complete master-sheet. Heb je eerst alleen **Search Console** → dan begin ik al met de prioriteitstiering.
