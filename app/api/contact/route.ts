import type { NextRequest } from "next/server";
import { requireDb } from "@/lib/db";
import { bad, EMAIL_RE, readJson } from "@/lib/request";

interface Body {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  synthetic?: boolean;
  meta?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req);
  if (!body?.email || !EMAIL_RE.test(body.email)) return bad("A valid email is required");
  if (!body.message || body.message.trim().length < 5) return bad("Please describe the problem");
  const sql = requireDb();
  const meta = { ...(body.meta ?? {}), user_agent: req.headers.get("user-agent") ?? "" };
  const [row] = await sql`INSERT INTO acme.helpdesk_tickets (email, name, subject, body, channel, meta, synthetic)
            VALUES (${body.email.slice(0, 200)}, ${(body.name ?? "").slice(0, 120)},
                    ${(body.subject || "Help request").slice(0, 200)}, ${body.message.slice(0, 5000)},
                    'contact_form', ${sql.json(meta as never)}, ${!!body.synthetic})
            RETURNING id`;
  return Response.json({ ticket_id: row.id });
}
