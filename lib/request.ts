import type { NextRequest } from "next/server";

export async function readJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Real visitors: Vercel's geo header. Simulator traffic: the simulated country it sends. */
export function countryOf(req: NextRequest, body?: { country?: string; synthetic?: boolean }): string | null {
  if (body?.synthetic && body.country) return body.country.toUpperCase().slice(0, 2);
  return req.headers.get("x-vercel-ip-country") || body?.country?.toUpperCase().slice(0, 2) || null;
}

export function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
