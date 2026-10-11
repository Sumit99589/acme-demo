import type { NextRequest } from "next/server";
import { requireDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { bad, countryOf, EMAIL_RE, readJson } from "@/lib/request";

interface Body {
  name?: string;
  email?: string;
  country?: string;
  synthetic?: boolean;
}

export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req);
  if (!body?.email || !EMAIL_RE.test(body.email)) return bad("A valid email is required");
  if (!body.name || body.name.trim().length < 2) return bad("Please tell us your name");
  const sql = requireDb();
  const id = newId("u");
  await sql`INSERT INTO acme.users (id, email, name, country, synthetic)
            VALUES (${id}, ${body.email.slice(0, 200)}, ${body.name.slice(0, 120)}, ${countryOf(req, body)},
                    ${!!body.synthetic})`;
  return Response.json({ user_id: id });
}
