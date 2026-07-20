# OMC.nl — Audit-bevindingen (Search Console + Analytics)

_2026-07-20 · 12 maanden · bron: GSC Performance + GA4 landingspagina's_

Master-data: [2026-07-20-master-url-sheet.csv](2026-07-20-master-url-sheet.csv) (alle URLs, klikken/vertoningen/positie + GA-sessies/conversies + tier).

---

## 1. Verkeer in één oogopslag
- **Organisch (Search Console):** ~**7.350 klikken/jaar** (~600/mnd) tegen ~**842.000 vertoningen** → **CTR 0,87%**, **gemiddelde positie ~12** (= pagina 2).
- **Totaal (GA4):** **44.512 sessies/jaar** (~3.700/mnd). Organisch is dus een **minderheid** van het verkeer — er komt veel binnen via direct/ads/e-mail (Google Ads-tag staat live).
- **Omzet in GA4: €0** — klopt: betalen gebeurt off-site op Plug&Pay, dus GA meet alleen conversie-*aantallen*, geen euro's.

**De kernconclusie:** je hebt enorme zichtbaarheid (842k vertoningen) maar staat gemiddeld op **pagina 2**. Het probleem is niet "te weinig content" — het is **positie**. De hefboom is bestaande pagina's omhoog duwen, niet meer pagina's maken.

---

## 2. Je winnaars (top-pagina's, organische klikken)
| klik/jr | pos | pagina |
|---:|---:|---|
| 590 | 10,2 | /zangles/ |
| 488 | 13,2 | /ukelele-les/ |
| 352 | 7,9 | /muziektheorie/ |
| 329 | 9,7 | /simpele-popliedjes-om-je-zang-mee-te-oefenen/ |
| 278 | 10,2 | /basgitaarles/ |
| 204 | 7,7 | /stembereik-voor-zangers/ |
| 182 | 5,9 | /dirigeren/ |

**Zang, ukelele en muziektheorie zijn je sterkste clusters.** Gitaar heeft de meeste vertoningen (akkoorden!) maar lagere posities.

---

## 3. De commerciële motor (conversies per contentpagina, GA4 key events)
| conv/jr | sessies | pagina |
|---:|---:|---|
| 21 | 1.052 | /basgitaarles/ |
| 16 | 4.953 | /gitaarles/ |
| 15 | 4.247 | /zangles/ |
| 6 | 2.171 | /ukelele-les/ |
| 6 | 291 | /dirigeren/ |
| 6 | 278 | /cursussen/ |
| 4 | 2.427 | /drumles/ |
| 4 | 681 | /muziektheorie/ |
| 3 | 5.247 | /pianoles/ |

Dit zijn de échte geld-pagina's → definitieve **tier-A**. Let op: `/gitaarles/` haalt maar 37 organische klikken maar 4.953 sessies + 16 conversies — die leunt op niet-organisch verkeer (ads/direct). Organisch daar winnen = directe upside.

---

## 4. ⭐ Grootste SEO-hefboom: keyword-kannibalisatie
Je hebt meerdere bijna-identieke URLs die op hetzelfde zoekwoord mikken en elkaar wégconcurreren — allemaal op pagina 2-6:

**"online gitaarles"-cluster:**
| klik | pos | url |
|---:|---:|---|
| 75 | 19,3 | /online-gitaar-leren-spelen/ |
| 37 | 25,0 | /gitaarles/ |
| 36 | 35,8 | /elektrische-gitaar-leren-spelen/ |
| 3 | 59,8 | /online-gitaar-les/ |
| 2 | 46,9 | /gitaarlessen-online/ |
| 1 | 55,2 | /online-gitaar-lessen/ |
| 0 | 49,1 | /gitaarles-online/ |

**"online pianoles"-cluster:** /online-piano-leren-spelen/ (183, pos 15) · /pianoles/ (101, pos 19) · /online-pianoles-voor-beginners/ (48) · /piano-leren-spelen-op-keyboard/ (41) · /online-pianolessen/ (12) · /pianolessen-online/ (4).

**"online muziekles"-cluster:** /muziekles-online/ (30) · /online-muziekles/ (1) · /muziekles/ (0, pos 68).

→ Deze versnippering is waarschijnlijk **dé reden dat je commerciële pagina's niet op pagina 1 staan.** De autoriteit wordt over 6+ zwakke URLs verdeeld i.p.v. één sterke.
**Actie (fase 4, ná de lift-and-shift):** per cluster één winnaar kiezen, de rest samenvoegen en met **301** doorverwijzen. Dit is de hoogste-ROI SEO-actie van het hele project — maar bewust NA de 1-op-1 migratie, niet tijdens.

---

## 5. Quick-wins (veel vertoningen, positie 5-15 = net pagina 2)
Kleine rankingwinst = grote klikwinst. Prioriteit voor content/SEO-verbetering:
- /zangles/ (48k vert, pos 10) · /noten-en-akkoorden-op-de-gitaar/ (30k, pos 12) · /basgitaarles/ (27k, pos 10) · /ukelele-les/ (22k, pos 13) · /online-piano-leren-spelen/ (22k, pos 15) · /simpele-popliedjes-om-je-zang-mee-te-oefenen/ (21k, pos 10) · /stembereik-voor-zangers/ (18k, pos 8) · **veel akkoord-pagina's** (pos 6-8, 10-19k vert elk) · /bladmuziek-voor-drummers/ · /intervallen-majeur-en-mineur/ · /drumstokken/.

---

## 6. Funnel-mechaniek (belangrijk voor de migratie)
- **`/checkout/…`-pagina's = Plug&Pay (off-site).** Live checken gaf **404** op het OMC-domein → ze staan dus niet op je site, precies volgens je model. De knoppen linken ernaartoe; buiten scope. ✅
- **`/betaling-succesvol…`-pagina's = oude bedankpagina's, NIET meer in gebruik** (correctie Johan 2026-07-20). Ze bestaan technisch nog (200) en GA schreef er in de meetperiode nog ~86 conversies aan toe, maar de huidige bedank-/conversieflow zit volledig in Plug&Pay. → **Niet migreren.** Conversiemeting loopt daarmee off-site; overweeg in fase 4 een outbound-click-event op de checkout-knoppen zodat je per pagina tóch ziet wat naar de checkout stuurt.

**Productcatalogus (afgeleid uit de checkout-slugs):** losse cursussen gitaar · piano · drum · zang · ukelele · basgitaar · gitaar-aanbidding · noten-leren-lezen · muziektheorie · leren-tokkelen · dirigeren · solfège · compositie-songwriting · inzing-oefeningen. Plus **actie-checkouts** (pianoactie, zangactie, gitaar-actie), **cadeaubon**, en **upsell-omc** (upsell naar het membership).

---

## 7. Reconciliatie & orphans
- De crawl-export (125 URLs) **miste ~17 geïndexeerde URLs**, o.a.: auteur-archiefpagina's **Boris Vreeswijk** & **Mexx Schilder** — **geen echte auteurs** (alleen mensen die wijzigingen deden, correctie Johan) → **opruimen**: in de rebuild niet als auteur opvoeren, hun URLs 301 naar home/over-ons. NB: `/author/johan-koelewijn/` haalt wél echte merk-traffic (69 klik, zoekwoord "johan koelewijn") → die byline/pagina behouden of 301 naar `/over-ons/`. Verder: de akkoorden-hub **/gitaarakkoorden-leren-spelen/** (3 klik, 249 vert — bestaat wél) reproduceren, en enkele oude varianten (`/gitaarles-online/`, `/online-gitaarschool/`, `/nl/muziek-les/…`) + afbeelding-URLs meenemen of 301'en.
- **Orphans uit de blog-export:**
  - `piano-kopen-of-huren` → **behouden**: live + geïndexeerd (451 vert, pos 27).
  - `akoestische-gitaar` → **laten vallen / 301**: 0 vertoningen, feitelijk dood.

---

## 8. Wat dit betekent voor het plan
1. **Migratie blijft lift-and-shift** — reproduceer álles 1-op-1, inclusief de ~17 extra URLs én de betaling-succesvol-pagina's + hun tracking.
2. **Consolidatie van de kannibalisatie-clusters = de grote SEO-winst**, maar bewust **fase 4** (ná de migratie), met 301's.
3. **Fase-4-prioriteit** = de quick-win-lijst (§5) + de commerciële motor (§3), niet de long-tail.
4. **Doel "beter scoren"** vertaalt zich concreet naar: *pagina 2 → pagina 1* op pagina's waar je al vertoningen hebt.
