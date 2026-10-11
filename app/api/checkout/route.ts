import type { NextRequest } from "next/server";
import { requireDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { PRICE_CENTS, subscribe, TEST_PAYMENT_METHODS, type TestPM } from "@/lib/payments";
import { bad, countryOf, readJson } from "@/lib/request";

interface Body {
  user_id?: string;
  email?: string;
  payment_method?: string;
  country?: string;
  synthetic?: boolean;
}

export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req);
  if (!body?.user_id || !body.email) return bad("user_id and email are required");
  const pm = body.payment_method as TestPM;
  if (!pm || !(pm in TEST_PAYMENT_METHODS)) return bad("Unknown test payment method");
  const sql = requireDb();
  const country = countryOf(req, body);
  const result = await subscribe({
    userId: body.user_id,
    email: body.email,
    paymentMethod: pm,
    country: country ?? undefined,
    synthetic: body.synthetic,
  });
  await sql`INSERT INTO acme.payment_attempts
              (id, user_id, amount_cents, provider, stripe_customer, stripe_subscription, stripe_payment_intent,
               outcome, decline_code, card_country, card_brand, synthetic)
            VALUES (${newId("pa")}, ${body.user_id}, ${PRICE_CENTS}, ${result.provider}, ${result.customer ?? null},
                    ${result.subscription ?? null}, ${result.paymentIntent ?? null}, ${result.outcome},
                    ${result.declineCode ?? null}, ${country}, ${TEST_PAYMENT_METHODS[pm].brand}, ${!!body.synthetic})`;
  const status = result.outcome === "succeeded" ? 200 : result.outcome === "declined" ? 402 : 502;
  return Response.json(
    { outcome: result.outcome, decline_code: result.declineCode ?? null, provider: result.provider },
    { status },
  );
}
