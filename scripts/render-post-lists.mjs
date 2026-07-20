// Rendert de blog-lijsten van de categorie-/blog-/auteur-pagina's statisch.
// Live laadt news-unit-new.js extra posts via de Phoenix-API (infinite
// scroll); die API verdwijnt na de cutover. Dit script doet exact dezelfde
// template-vervanging (#postBlockPlaceholder) op build-niveau, met de
// veiliggestelde API-data uit _bron/content/api/*.json.
// Volgorde in de pipeline: extract-content -> render-post-lists -> fetch-assets.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLUGS = ["blog", "drumstel", "gitaar", "home", "muziekles", "piano", "ukelele", "zingen", "author/johan-koelewijn", "author/j-koelewijn"];

// vind einde van de div die op startIdx begint (dieptetelling)
function divEnd(html, startIdx) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = html.indexOf(">", startIdx) + 1;
  let depth = 1, m;
  while ((m = re.exec(html)) !== null) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return m.index + "</div>".length;
  }
  throw new Error("onafgesloten div");
}

const relative = (u) => (u ?? "").replace(/https?:\/\/(?:www\.)?onlinemuziekcursus\.nl(\/[^"']*)?/, (_, p) => p || "/");

// 1-op-1 de vervangingslogica van news-unit-new.js (appendPostsToDom).
// Let op: Phoenix-HTML bevat newlines bínnen de placeholder-tags (bv.
// `<post-excerpt\n:max-length="80">`), dus alle patronen whitespace-tolerant.
function renderPost(tpl, post) {
  const tag = (name, attrs = "") => new RegExp(`<${name}${attrs ? `\\s+${attrs}` : ""}\\s*>\\s*</${name}>`, "g");
  let h = tpl;
  h = h.replace(tag("post-title"), post.title);
  h = h.replace(/<full-post-link>/, `<a class="post-link-class" href="${relative(post.permalink)}">`);
  h = h.replace(tag("post-author-name"), post.author);
  h = h.replace(/<\/full-post-link>/, "</a>");
  h = h.replace(tag("post-shares-amount"), post.shares_amount);
  h = h.replace(tag("post-comments-amount"), post.comments_amount);
  h = h.replace(tag("post-author-image-url"), post.author_image);
  if (post.is_sticky) h = h.replace(tag("post-pinned"), '<i class="pinned-post fas fa-thumbtack"></i>');
  h = h.replace(tag("primaryblogcategory"), `<a href="${relative(post.category_url)}">${post.category}</a>`);
  const srcset = post.image_srcset ? `srcset="${post.image_srcset}"` : "";
  h = h.replace(tag("post-image"), `<img src="${post.image}" ${srcset}>`);
  let x = post.excerpt ?? "";
  x = x.replace(/\[.*\]/, "").replace(/<a.*>/, "").replace(/<\/.*a>/, "").replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
  h = h.replace(tag("post-excerpt", ':max-length="80"'), x.slice(0, 80) + "...");
  if (post.legacy_date !== false) h = h.replace(tag("post-date"), post.legacy_date);
  h = h.replace(tag("readtime"), post.readtime);
  return h;
}

for (const slug of SLUGS) {
  const fragPath = join(root, "content", "pages", `${slug}.html`);
  let frag = readFileSync(fragPath, "utf8");
  const api = JSON.parse(readFileSync(join(root, "_bron", "content", "api", `${slug.replace("/", "__")}.json`), "utf8"));

  // template uit de pagina zelf, net als de live JS (let op: Phoenix-HTML
  // bevat newlines binnen tags, dus whitespace-tolerant matchen)
  const tplMatch = frag.match(/<div\s+id="postBlockPlaceholder"[^>]*>/);
  if (!tplMatch) { console.log(`− ${slug}: geen postBlockPlaceholder, overgeslagen`); continue; }
  const tplStart = tplMatch.index;
  const tplEnd = divEnd(frag, tplStart);
  const tpl = frag.slice(frag.indexOf(">", tplStart) + 1, tplEnd - "</div>".length);

  // alleen posts toevoegen die nog niet server-side in de pagina staan
  const all = api.posts_per_page.flat();
  const missing = all.filter((p) => !frag.includes(`href="${relative(p.permalink)}"`));
  const blocks = missing.map((p) => renderPost(tpl, p)).join("\n");

  // toevoegen op de plek waar de JS ze ook appendt: in de holder, vóór de placeholder
  frag = frag.slice(0, tplStart) + blocks + "\n" + frag.slice(tplStart);
  writeFileSync(fragPath, frag);
  console.log(`✓ ${slug}: ${missing.length} posts statisch toegevoegd (${all.length} totaal)`);
}

// news-unit-new.js niet meer laden op deze pagina's: alles staat statisch in
// de HTML; het script zou alleen nog dode API-calls doen.
const paPath = join(root, "content", "page-assets.json");
const pa = JSON.parse(readFileSync(paPath, "utf8"));
for (const slug of SLUGS) {
  if (pa[slug]) pa[slug].js = pa[slug].js.filter((s) => !s.includes("news-unit-new"));
}
writeFileSync(paPath, JSON.stringify(pa, null, 2) + "\n");
console.log("news-unit-new.js verwijderd uit page-assets voor deze pagina's");
