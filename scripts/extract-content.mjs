// Zet Phoenix live-HTML (_bron/content/pages/raw/<slug>.html) om naar een
// schoon body-fragment in content/pages/<slug>.html dat de Next.js-pagina's
// 1-op-1 renderen. Content zelf wordt niet aangepast — alleen Phoenix-admin,
// scripts en tracking gaan eruit (tracking komt netjes terug via de layout).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = join(root, "_bron", "content", "pages", "raw");
const outDir = join(root, "content", "pages");
const metaLivePath = join(root, "content", "meta-live.json");
const pageAssetsPath = join(root, "content", "page-assets.json");

// Tracking/analytics/admin laden we niet mee als pagina-asset: tracking zit
// centraal in de layout, Phoenix-admin en -analytics horen niet in de site.
// popups.js (de "attention grabbers") is bewust uitgezet (2026-07-20): alle 5
// popups op de site waren gratis-proefles-ribbons — die funnel is afgebouwd.
// Let op: img-popup-box/video-popup-box (lightboxes) blijven wél.
// forms_v2.js is ook uitgezet (2026-07-20): het contactformulier (Vue-component,
// Phoenix-backend) is bewust verwijderd — zie fase 4-notities.
const EXCLUDE_ASSET = /googletagmanager\.com|phx-analytics|phx-admin-menu|connect\.facebook\.net|\/popups\.js|forms_v2\.js/;

// Bewust niet gemigreerd (beslissing 2026-07-20): de gratis-proefles-funnel
// is afgebouwd — deze URLs 301'en in next.config.ts. Raw HTML blijft in
// _bron/ als archief.
const SKIP_PAGES = new Set([
  "keuze-pagina-proefles",
  "gratis-gitaarlessen",
  "gratis-pianolessen",
  "gratis-zanglessen",
  "affiliate-programma", // dubbelop met /affiliates/ — 301 (beslissing 2026-07-21)
]);

// Per pagina de head-assets vastleggen: de stylesheets en scripts verschillen
// per Phoenix-template (o.a. card-theme vs modern-classic, popups/optin-JS).
function extractPageAssets(html, head) {
  const flat = (s) => s.replace(/\s+/g, " ");
  const css = [];
  for (const m of flat(head).matchAll(/<link\b[^>]*>/g)) {
    const tag = m[0];
    // gewone stylesheets én preload-as-style-links (o.a. article-layouts op
    // blogposts, enkel-gequote attributen) tellen mee
    const isSheet = /rel=['"]stylesheet['"]/.test(tag) ||
      (/rel=['"]preload['"]/.test(tag) && /as=['"]style['"]/.test(tag));
    if (!isSheet) continue;
    const href = tag.match(/href=['"]([^'"]+)['"]/)?.[1];
    if (href && !EXCLUDE_ASSET.test(href) && !css.includes(href)) css.push(href);
  }
  const js = [];
  // absolute én site-relatieve script-srcs (o.a. /js/article-layouts/main.js)
  for (const m of flat(html).matchAll(/<script[^>]*\ssrc=['"]((?:https?:\/\/|\/)[^'"]+)['"]/g)) {
    const src = m[1];
    if (!EXCLUDE_ASSET.test(src) && !js.includes(src)) js.push(src);
  }
  return { css, js };
}

// Verwijdert een <div ...> t/m bijbehorende </div> op basis van div-diepte.
function removeBalancedDiv(html, startIdx) {
  const tagRe = /<div\b|<\/div>/g;
  tagRe.lastIndex = startIdx + 1;
  let depth = 1;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) {
      return html.slice(0, startIdx) + html.slice(m.index + "</div>".length);
    }
  }
  throw new Error("Onafgesloten <div> bij index " + startIdx);
}

function unescapeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .trim();
}

// Titel/description/canonical/robots zoals live gerenderd (bron van waarheid
// voor blogposts; voor pages als QA-kruischeck naast pages-index.csv).
function extractHeadMeta(head) {
  const pick = (re) => {
    const m = head.replace(/\n/g, " ").match(re);
    return m ? unescapeEntities(m[1]) : "";
  };
  return {
    title: pick(/<title>(.*?)<\/title>/),
    metadesc: pick(/<meta\s+name="description"\s+content="(.*?)"/),
    canonical: pick(/<link\s+rel="canonical"\s+href="(.*?)"/),
    robots: pick(/<meta\s+name="robots"\s+content="(.*?)"/),
  };
}

function extract(slug) {
  const html = readFileSync(join(rawDir, `${slug}.html`), "utf8");

  const bodyStart = html.indexOf("<body");
  const head = html.slice(0, bodyStart);
  // Let op: Phoenix zet o.a. #articleData en het article-layouts-script NA
  // </body></html> (invalide maar door browsers getolereerd). Daarom nemen we
  // alles t/m het einde van het bestand mee en strippen we de sluittags.

  const metaLive = existsSync(metaLivePath) ? JSON.parse(readFileSync(metaLivePath, "utf8")) : {};
  metaLive[slug] = extractHeadMeta(head);
  mkdirSync(dirname(metaLivePath), { recursive: true });
  writeFileSync(metaLivePath, JSON.stringify(metaLive, null, 2) + "\n");

  const pageAssets = existsSync(pageAssetsPath) ? JSON.parse(readFileSync(pageAssetsPath, "utf8")) : {};
  pageAssets[slug] = extractPageAssets(html, head);
  writeFileSync(pageAssetsPath, JSON.stringify(pageAssets, null, 2) + "\n");
  let body = html.slice(html.indexOf(">", bodyStart) + 1).replace(/<\/(?:body|html)>/g, "");

  // Pagina-specifieke styles staan in de head — meenemen in het fragment.
  const styles = (head.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []).join("\n");

  // Config-globals uit de head óók meenemen (window.phxsite,
  // window.active_data_resources_comments — de reactie-app leest die).
  const headConfigs = [];
  for (const m of head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/^\s*window\.[a-zA-Z_$][\w$]*\s*=/.test(m[2]) && !/dataLayer|gtag\(|fbq\(/.test(m[2]) && !/\ssrc=/.test(m[1])) {
      headConfigs.push(m[0]);
    }
  }

  // Alle scripts eruit (fb-pixel/GA/Phoenix); tracking komt terug via de layout,
  // benodigde Phoenix client-JS via de pagina's zelf. Wat WEL blijft:
  // - JSON-datablokken (type="application/json", o.a. #articleData)
  // - pure config-globals (`window.… = {…}`, o.a. phxsite, article_id en
  //   active_data_resources_comments — popups.js en de reactie-app lezen die),
  //   behalve tracking (dataLayer/gtag zit al in de layout)
  // De JSON-blokken worden eerst beschermd met placeholders: hun content bevat
  // artikel-HTML met letterlijke `<script`-openingen (o.a. html5shiv in een
  // IE-conditional) waar de strip-regex anders middenin zou aanhaken.
  const jsonBlocks = [];
  body = body.replace(/<script\b[^>]*type=["']application\/json["'][^>]*>[\s\S]*?<\/script>/g, (m) => {
    jsonBlocks.push(m);
    return `@@JSON_BLOCK_${jsonBlocks.length - 1}@@`;
  });
  body = body.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (m, attrs, content) => {
    const isConfigGlobal = /^\s*window\.[a-zA-Z_$][\w$]*\s*=/.test(content) &&
      !/dataLayer|gtag\(|fbq\(/.test(content) && !/\ssrc=/.test(attrs) &&
      // popup-config hoort bij het uitgezette popups.js (proefles-ribbons);
      // window.active_data_resources_comments (reactie-app) blijft wél
      !/^\s*window\.active_data_resources\s*=/.test(content);
    // lazyload-init MOET blijven: zet window.lazyLoadOptions waarmee
    // lazyload.min.js zichzelf initialiseert (hero-video's, lazy iframes)
    const isLazyInit = /lazyLoadOptions/.test(content);
    return isConfigGlobal || isLazyInit ? m : "";
  });
  body = body.replace(/@@JSON_BLOCK_(\d+)@@/g, (_, i) => jsonBlocks[+i]);
  body = body.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");

  // Phoenix-adminmenu is geen site-content. Let op: "element-menu" NIET
  // strippen — dat is de footer-navigatie, geen admin-element.
  for (const cls of ["phoenix-admin-menu-wrapper"]) {
    let idx;
    while ((idx = body.indexOf(`class="${cls}`)) !== -1) {
      body = removeBalancedDiv(body, body.lastIndexOf("<div", idx));
    }
  }

  // Interne absolute links -> pad-relatief (mét trailing slash, ongewijzigd pad),
  // zodat preview en nieuw domein identiek werken.
  body = body.replace(/href="https?:\/\/(?:www\.)?onlinemuziekcursus\.nl(\/[^"]*)?"/g, (_, path) => `href="${path || "/"}"`);

  // Funnel-afbouw (beslissing 2026-07-20): de "Gratis proefles!"-navigatieknop
  // wordt een cursusknop — de proefles-funnel bestaat niet meer (zie SKIP_PAGES).
  body = body.replace(/href="\/keuze-pagina-proefles\/"/g, 'href="/cursussen/"');
  body = body.replace(/Gratis proefles!/g, "Bekijk alle cursussen!");

  // Contactformulier verwijderd (beslissing 2026-07-20): de Vue-component
  // werkt alleen met de Phoenix-backend; mail/telefoon blijven op de pagina.
  body = body.replace(/<form-vue-component[\s\S]*?<\/form-vue-component>/g, "");

  // Logo gelijkgetrokken (beslissing 2026-07-21): het onscherpe 220x55-logo
  // (waarvan geen hogere resolutie bestaat) wordt overal vervangen door het
  // scherpe logo, begrensd op de headerhoogte van de overige pagina's.
  // Paginaspecifieke alt/title blijven behouden.
  body = body.replace(/<img([^>]*)Nieuwe-logo-OMC-klein-220x55\.png([^>]*)>/g, (m) => {
    const alt = m.match(/alt="([^"]*)"/)?.[1] ?? "Online Muziek Cursus";
    const title = m.match(/title="([^"]*)"/)?.[1] ?? "";
    return `<img src="https://media-01.imu.nl/storage/onlinemuziekcursus.nl/21/online-muzieklessen-1.png" alt="${alt}"${title ? ` title="${title}"` : ""} style="max-height:60px;width:auto">`;
  });

  const outFile = join(outDir, `${slug}.html`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${headConfigs.join("\n")}\n${styles}\n${body}`);
  console.log(`✓ ${slug}: fragment geschreven naar content/pages/${slug}.html`);
}

const slugs = process.argv.slice(2);
for (const slug of slugs.length ? slugs : readdirSync(rawDir, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""))) {
  if (SKIP_PAGES.has(slug)) { console.log(`− ${slug}: overgeslagen (bewust niet gemigreerd)`); continue; }
  extract(slug);
}
