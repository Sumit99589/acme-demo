import type { NextRequest } from "next/server";

// First-party proxy for the Whydunit snippet: avoids CORS and ad blockers, and adds Vercel's geo header.
const ENGINE = process.env.WHYDUNIT_ENGINE_URL;
const ALLOWED = new Set(["ingest/events", "ingest/replay"]);

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const path = (await ctx.params).path.join("/");
  if (!ALLOWED.has(path)) return new Response("not found", { status: 404 });
  if (!ENGINE) return new Response(null, { status: 202 }); // engine not configured: drop silently
  const headers: Record<string, string> = {
    "content-type": req.headers.get("content-type") ?? "application/json",
  };
  for (const h of ["content-encoding", "x-whydunit-key", "user-agent"]) {
    const v = req.headers.get(h);
    if (v) headers[h] = v;
  }
  const country = req.headers.get("x-vercel-ip-country");
  if (country) headers["x-whydunit-country"] = country;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) headers["x-forwarded-for"] = fwd;
  const res = await fetch(`${ENGINE.replace(/\/$/, "")}/${path}${req.nextUrl.search}`, {
    method: "POST",
    headers,
    body: await req.arrayBuffer(),
  });
  return new Response(res.body, { status: res.status, headers: { "content-type": "application/json" } });
}
