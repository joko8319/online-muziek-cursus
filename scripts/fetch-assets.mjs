// Haalt alle externe assets (afbeeldingen, CSS, JS, fonts) binnen naar public/
// en herschrijft de verwijzingen in content/pages/**.html, zodat de site niet
// afhankelijk blijft van Phoenix/imu-CDN's na het verlaten van PhoenixSite.
// Idempotent: bestaande downloads worden overgeslagen; manifest in
// content/asset-manifest.json.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = join(root, "content", "pages");
const publicDir = join(root, "public");
const manifestPath = join(root, "content", "asset-manifest.json");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

// Bron-URL -> lokaal pad (onder public/). /wp-content/-paden behouden hun
// exacte URL-pad; CDN-assets komen onder /assets/.
function localPathFor(url) {
  // relatieve site-URLs (bv. /js/article-layouts/main.js) horen bij het OMC-domein
  const u = new URL(url, "https://onlinemuziekcursus.nl");
  // decodeer percent-encoding en normaliseer unicode naar NFC: bestandsnamen
  // met bv. "ë" komen in de bron zowel NFC als NFD voor en moeten op disk
  // één echt-unicode bestand worden (anders 404 op Vercel/Linux). Trailing
  // slashes (komen voor in kapotte bron-URLs zoals "…foto.jpg/") strippen.
  const clean = (p) => decodeURIComponent(posix.normalize(p).replace(/^(\.\.\/)+/, "/")).normalize("NFC").replace(/\/$/, "");
  if (u.hostname === "media-01.imu.nl") {
    if (u.pathname.startsWith("/storage/onlinemuziekcursus.nl/"))
      return "/assets/media" + clean(u.pathname.slice("/storage/onlinemuziekcursus.nl".length));
    if (u.pathname.startsWith("/wp-content/uploads") && u.searchParams.get("url"))
      return "/assets/uploads/" + u.searchParams.get("url").replace(/^onlinemuziekcursus\.nl\//, "").split("?")[0].normalize("NFC");
    return "/assets/media/overig" + clean(u.pathname);
  }
  if (u.hostname === "cdn.phoenixsite.nl" || u.hostname === "app.phoenixsite.nl") {
    // custom.css verschilt per website_design_id (card/modern-classic/contact)
    if (u.pathname.endsWith("custom.css"))
      return `/assets/phoenix/css/custom-${u.searchParams.get("website_design_id") ?? "0"}.css`;
    return "/assets/phoenix" + clean(u.pathname.replace(/^\/pageomatic\/assets/, ""));
  }
  if (u.hostname === "phoenixsite.nl") return "/assets/ext/phoenixsite/" + decodeURIComponent(posix.basename(u.pathname)).normalize("NFC");
  if (u.hostname === "cdnjs.cloudflare.com") return "/assets/vendor" + clean(u.pathname.replace(/^\/ajax\/libs/, ""));
  if (u.hostname === "fonts.googleapis.com") {
    const family = (u.searchParams.get("family") ?? "font").split(":")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `/assets/fonts/${family}.css`;
  }
  if (u.hostname === "fonts.gstatic.com") return "/assets/fonts/files" + clean(u.pathname);
  if (u.hostname.endsWith("onlinemuziekcursus.nl")) return clean(u.pathname); // /wp-content/... exact pad behouden
  throw new Error("Geen mapping voor " + url);
}

async function download(url, localPath) {
  const dest = join(publicDir, localPath);
  if (existsSync(dest)) return true;
  // let op: sinds de DNS-cutover wijst onlinemuziekcursus.nl naar onze eigen
  // Vercel-site — netwerkfouten (bv. dode http://-links) mogen nooit crashen
  let res;
  try {
    res = await fetch(new URL(url, "https://onlinemuziekcursus.nl").href, { headers: { "User-Agent": UA }, redirect: "follow" });
  } catch (e) {
    console.warn(`  ✗ netwerkfout ${url} (${e.cause?.code ?? e.message})`);
    return false;
  }
  if (!res.ok) {
    console.warn(`  ✗ ${res.status} ${url}`);
    return false;
  }
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

// Verwerk een CSS-bestand: download alles waar url()/@import naar wijst en
// herschrijf naar absolute lokale paden. Recursief voor geïmporteerde CSS.
const cssSeen = new Set();
async function processCss(cssUrl, localPath) {
  manifest[cssUrl] = localPath; // ook registreren bij dubbele URL-varianten (?v=)
  if (cssSeen.has(localPath)) return;
  cssSeen.add(localPath);
  const dest = join(publicDir, localPath);
  if (existsSync(dest)) { manifest[cssUrl] = localPath; return; } // al verwerkt in eerdere run
  let res;
  try {
    res = await fetch(new URL(cssUrl, "https://onlinemuziekcursus.nl").href, { headers: { "User-Agent": UA } });
  } catch (e) { console.warn(`  ✗ netwerkfout ${cssUrl}`); return; }
  if (!res.ok) { console.warn(`  ✗ ${res.status} ${cssUrl}`); return; }
  let css = await res.text();
  const refs = new Set();
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) refs.add(m[1]);
  for (const m of css.matchAll(/@import\s+['"]([^'"]+)['"]/g)) refs.add(m[1]);
  for (const ref of refs) {
    if (ref.startsWith("data:") || ref.startsWith("#")) continue;
    const abs = new URL(ref, new URL(cssUrl, "https://onlinemuziekcursus.nl")).href;
    let refLocal;
    try { refLocal = localPathFor(abs); } catch { continue; }
    if (refLocal.endsWith(".css")) await processCss(abs, refLocal);
    else await download(abs, refLocal);
    css = css.split(ref).join(refLocal);
    manifest[abs] = refLocal;
  }
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, css);
  manifest[cssUrl] = localPath;
  console.log(`✓ css ${localPath} (${refs.size} refs)`);
}

// ---- 1. Per-pagina head-assets (stylesheets + client-JS) ----
// Bron: content/page-assets.json (gevuld door extract-content.mjs). Elke
// unieke CSS/JS wordt gedownload en de JSON herschreven naar lokale paden.
const pageAssetsPath = join(root, "content", "page-assets.json");
const pageAssets = JSON.parse(readFileSync(pageAssetsPath, "utf8"));
const uniq = { css: new Set(), js: new Set() };
const needsFetch = (u) => u.startsWith("http") || (u.startsWith("/") && !u.startsWith("/assets/") && !existsSync(join(publicDir, u.split("?")[0])));
for (const { css, js } of Object.values(pageAssets)) {
  css.forEach((u) => needsFetch(u) && uniq.css.add(u));
  js.forEach((u) => needsFetch(u) && uniq.js.add(u));
}
for (const url of uniq.css) await processCss(url, localPathFor(url));
for (const url of uniq.js) {
  const local = localPathFor(url);
  if (await download(url, local)) { manifest[url] = local; console.log(`✓ js  ${local}`); }
}
for (const entry of Object.values(pageAssets)) {
  entry.css = entry.css.map((u) => manifest[u] ?? u);
  entry.js = entry.js.map((u) => manifest[u] ?? u);
}
writeFileSync(pageAssetsPath, JSON.stringify(pageAssets, null, 2) + "\n");

// ---- 2. Assets in de contentfragmenten ----
// let op: backslash uitgesloten — bij het scannen van JSON-escaped context
// (\") zou die anders aan de URL blijven plakken
const ASSET_RE = /https?:\/\/(?:media-01\.imu\.nl|cdn\.phoenixsite\.nl|app\.phoenixsite\.nl|phoenixsite\.nl|fonts\.googleapis\.com|fonts\.gstatic\.com)\/[^"'()\s<>\\]+|https?:\/\/(?:www\.)?onlinemuziekcursus\.nl\/[^"'()\s<>\\]*wp-content[^"'()\s<>\\]+/g;

const fragments = readdirSync(pagesDir, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".html"));
const urls = new Set();
for (const f of fragments) {
  const txt = readFileSync(join(pagesDir, f), "utf8");
  for (const m of txt.matchAll(ASSET_RE)) urls.add(m[0]);
  // ook JSON-escaped URLs (https:\/\/… en \uXXXX-escapes) meenemen — o.a. in #articleData
  const unescaped = txt.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\\//g, "/");
  for (const m of unescaped.matchAll(ASSET_RE)) urls.add(m[0]);
  for (const m of txt.matchAll(/(?:href|src)="(\/wp-content\/[^"]+)"/g))
    urls.add("https://onlinemuziekcursus.nl" + m[1]);
}
console.log(`${urls.size} unieke asset-URLs in ${fragments.length} fragmenten`);

let ok = 0, failed = [];
const queue = [...urls];
async function worker() {
  while (queue.length) {
    const url = queue.pop();
    let local;
    try { local = localPathFor(url); } catch { failed.push(url); continue; }
    if (local.endsWith(".css")) { await processCss(url, local); ok++; continue; }
    if (await download(url, local)) { manifest[url] = local; ok++; }
    else failed.push(url);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`downloads: ${ok} ok, ${failed.length} mislukt`);
for (const f of failed) console.log("  MISLUKT:", f);

// ---- 3. Verwijzingen in fragmenten herschrijven ----
let rewritten = 0;
for (const f of fragments) {
  const p = join(pagesDir, f);
  let txt = readFileSync(p, "utf8");
  const before = txt;
  const escJson = (s) => s.split("/").join("\\/");
  const escUni = (s) => s.replace(/[\u0080-\uffff]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
  for (const [url, local] of Object.entries(manifest)) {
    txt = txt.split(url).join(local);
    txt = txt.split(url.replace(/&/g, "&amp;")).join(local);
    txt = txt.split(escJson(url)).join(escJson(local)); // JSON-escaped vorm (#articleData)
    txt = txt.split(escUni(escJson(url))).join(escJson(local)); // idem met \uXXXX-escapes
  }
  // relatieve /wp-content/-refs wijzen al naar het juiste (behouden) pad
  if (txt !== before) { writeFileSync(p, txt); rewritten++; }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`${rewritten} fragmenten herschreven; manifest: ${Object.keys(manifest).length} entries`);
