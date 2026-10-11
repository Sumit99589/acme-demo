import { connection } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  await connection(); // always run at request time, never prerendered
  let db = "not_configured";
  if (sql) {
    try {
      await sql`SELECT 1`;
      db = "ok";
    } catch {
      db = "error";
    }
  }
  return Response.json({
    ok: db !== "error",
    db,
    payments: process.env.STRIPE_SECRET_KEY ? "stripe_test" : "mock",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    deployment: process.env.VERCEL_URL ?? null,
  });
}
