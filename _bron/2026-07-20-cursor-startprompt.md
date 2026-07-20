# OMC.nl — Startprompt voor Cursor / Claude

## Zo begin je (3 stappen)

**1. Zet het bronpakket in je project.** Open in Cursor de terminal (in je projectmap) en draai:
```
cp -R ~/.flashbag/output/mr-music/omc-migratie ./_bron
```
Nu staat het hele pakket als `_bron/` naast je code — Cursor/Claude kan het lezen.

**2. Plak de prompt hieronder** in Cursor/Claude.

**3. Geef pas akkoord** als de AI je eerst een korte samenvatting + plan teruggeeft (stap 1 van de prompt).

---

## 📋 Plak deze prompt

> Je helpt me **OnlineMuziekCursus.nl 1-op-1 herbouwen** (lift-and-shift) van PhoenixSite naar een nieuwe **Next.js**-site op **Vercel**. De volledige bron staat in de map `_bron/`.
>
> Doe dit in deze volgorde:
> 1. **Lees eerst volledig**: `_bron/2026-07-20-BUILD-LEESMIJ.md` en `_bron/2026-07-20-fase2-build-checklist.md`. Geef me daarna een korte samenvatting + je aanpak, en wacht op mijn akkoord.
> 2. Zet een **Next.js-project** op (App Router, TypeScript) met in `next.config`: **`trailingSlash: true`** — harde eis, alle URLs eindigen op `/`.
> 3. Bouw als **proef eerst twee pagina's**: de homepage (`/`) en `/zangles/`. Content uit `_bron/content/pages/raw/zangles.html`; meta-titel/description uit `_bron/2026-07-20-pages-index.csv`. Zet `robots: index, follow`.
> 4. Start een **preview** zodat ik kan controleren dat `/zangles/` (mét slash) een 200 geeft en er goed uitziet. Daarna bouwen we de rest af via de checklist.
>
> **Harde regels:**
> - Elke URL exact hetzelfde pad als het origineel, **mét trailing slash**. Niets hernoemen, samenvoegen of "opschonen" — dat is een latere fase.
> - Blogposts: content in `_bron/content/blog/<slug>.html`. Pagina's: `_bron/content/pages/raw/<slug>.html` (+ `txt/` voor leesbare tekst).
> - Checkout-knoppen linken naar de Plug&Pay-URLs (zie `_bron/2026-07-20-master-url-sheet.csv`).
> - Titels/descriptions 1-op-1 overnemen; nog niet verbeteren (dat is fase 4).

---

## Bouwvolgorde daarna (uit de checklist)
1. Homepage + commerciële motor: `zangles`, `basgitaarles`, `gitaarles`, `ukelele-les`, `pianoles`, `drumles`, `dirigeren`, `cursussen`.
2. Quick-wins + akkoord-cluster.
3. Info/blog/legal/systeem.

Vink af in `_bron/2026-07-20-fase2-build-checklist.md` naarmate pagina's staan.
