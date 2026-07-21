// Minificeert alle CSS onder public/ (behalve al-geminificeerde .min.css).
// Puur mechanisch (whitespace/commentaar), gedrag verandert niet. Idempotent.
// Pipeline-volgorde: extract-content -> render-post-lists -> fetch-assets -> minify-css.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

let voor = 0, na = 0, n = 0;
for (const f of readdirSync(publicDir, { recursive: true, encoding: "utf8" })) {
  if (!f.endsWith(".css") || f.endsWith(".min.css")) continue;
  const p = join(publicDir, f);
  const css = readFileSync(p, "utf8");
  const res = await transform(css, { loader: "css", minify: true });
  if (res.code.length < css.length) {
    writeFileSync(p, res.code);
    voor += css.length; na += res.code.length; n++;
  }
}
console.log(`✓ ${n} CSS-bestanden geminificeerd: ${Math.round(voor / 1024)} kB -> ${Math.round(na / 1024)} kB`);
