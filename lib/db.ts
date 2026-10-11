import postgres from "postgres";

// Acme's own data lives in the `acme` schema of the shared Postgres (see db/schema.sql).
const url = process.env.ACME_DATABASE_URL || process.env.DATABASE_URL;

declare global {
  var __acmeSql: ReturnType<typeof postgres> | undefined;
}

export const sql: ReturnType<typeof postgres> | null = url
  ? (globalThis.__acmeSql ??= postgres(url, { max: 3, idle_timeout: 20, prepare: false }))
  : null;

export function requireDb() {
  if (!sql) throw new Error("ACME_DATABASE_URL is not configured");
  return sql;
}
