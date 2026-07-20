import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// De reactiesectie (article-layouts main.js, Vue) haalt reacties op via
// GET /articles/<uuid>/comments. Live deed Phoenix dat; hier serveren we de
// op 2026-07-20 veiliggestelde data statisch (content/comments/<uuid>.json —
// 7 reacties op 5 posts, lege respons voor de rest). Reacties plaatsen
// (POST) werkt bewust niet meer — zie fase 4-notities.
export const dynamic = "force-static";

export function generateStaticParams() {
  return readdirSync(join(process.cwd(), "content", "comments"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ uuid: f.replace(/\.json$/, "") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  try {
    const data = readFileSync(join(process.cwd(), "content", "comments", `${uuid}.json`), "utf8");
    return new Response(data, { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  }
}
