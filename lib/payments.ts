import Stripe from "stripe";

// Stripe TEST MODE only. Real declines come from Stripe's documented test PaymentMethods.
export const TEST_PAYMENT_METHODS = {
  pm_card_visa: { label: "Visa · succeeds", brand: "visa" },
  pm_card_mastercard: { label: "Mastercard · succeeds", brand: "mastercard" },
  pm_card_amex: { label: "Amex · succeeds", brand: "amex" },
  pm_card_chargeDeclined: { label: "Visa · generic decline", brand: "visa", decline: "generic_decline" },
  pm_card_chargeDeclinedInsufficientFunds: {
    label: "Visa · insufficient funds",
    brand: "visa",
    decline: "insufficient_funds",
  },
  pm_card_chargeDeclinedLostCard: { label: "Visa · lost card", brand: "visa", decline: "lost_card" },
  pm_card_chargeDeclinedExpiredCard: { label: "Visa · expired card", brand: "visa", decline: "expired_card" },
  pm_card_chargeDeclinedProcessingError: { label: "Visa · processing error", brand: "visa", decline: "processing_error" },
} as const;

export type TestPM = keyof typeof TEST_PAYMENT_METHODS;
export const PRICE_CENTS = 1200;

export interface PaymentResult {
  outcome: "succeeded" | "declined" | "error";
  provider: "stripe" | "mock";
  declineCode?: string;
  customer?: string;
  subscription?: string;
  paymentIntent?: string;
  message?: string;
}

const key = process.env.STRIPE_SECRET_KEY;
if (key && !key.startsWith("sk_test_") && !key.startsWith("rk_test_")) {
  throw new Error("Acme only runs Stripe in test mode: STRIPE_SECRET_KEY must be a test key");
}
const stripe = key ? new Stripe(key) : null;
let priceId: string | undefined;

async function proPrice(s: Stripe): Promise<string> {
  if (priceId) return priceId;
  const found = await s.prices.list({ lookup_keys: ["acme_pro_monthly"], limit: 1 });
  if (found.data[0]) return (priceId = found.data[0].id);
  const product = await s.products.create({ name: "Acme Notes Pro" });
  const price = await s.prices.create({
    product: product.id,
    unit_amount: PRICE_CENTS,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "acme_pro_monthly",
  });
  return (priceId = price.id);
}

export async function subscribe(opts: {
  userId: string;
  email: string;
  paymentMethod: TestPM;
  country?: string;
  synthetic?: boolean;
}): Promise<PaymentResult> {
  const meta = { acme_user_id: opts.userId, country: opts.country ?? "", synthetic: String(!!opts.synthetic) };
  if (!stripe) {
    // No Stripe key: same interface, deterministic outcome from the test PaymentMethod name.
    const decline = (TEST_PAYMENT_METHODS[opts.paymentMethod] as { decline?: string }).decline;
    return decline
      ? { outcome: "declined", provider: "mock", declineCode: decline }
      : { outcome: "succeeded", provider: "mock", subscription: `sub_mock_${opts.userId}` };
  }
  // First month is a real PaymentIntent (so declines are recorded on the PaymentIntent and its charge, with
  // decline codes); the subscription then starts from the saved card with that month already paid.
  let customer: Stripe.Customer | undefined;
  let paymentIntent: Stripe.PaymentIntent | undefined;
  try {
    customer = await stripe.customers.create({ email: opts.email, metadata: meta });
    paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE_CENTS,
      currency: "usd",
      customer: customer.id,
      payment_method: opts.paymentMethod,
      allowed_payment_method_types: ["card"],
      confirm: true,
      setup_future_usage: "off_session",
      description: "Acme Notes Pro — first month",
      metadata: meta,
    });
    if (paymentIntent.status !== "succeeded") {
      return {
        outcome: "error",
        provider: "stripe",
        customer: customer.id,
        paymentIntent: paymentIntent.id,
        message: `PaymentIntent ${paymentIntent.status}`,
      };
    }
    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: await proPrice(stripe) }],
      default_payment_method: paymentIntent.payment_method as string,
      trial_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
      metadata: { ...meta, first_payment_intent: paymentIntent.id },
    });
    return {
      outcome: "succeeded",
      provider: "stripe",
      customer: customer.id,
      subscription: sub.id,
      paymentIntent: paymentIntent.id,
    };
  } catch (e) {
    const err = e as Stripe.errors.StripeError;
    if (err.type === "StripeCardError") {
      return {
        outcome: "declined",
        provider: "stripe",
        declineCode: err.decline_code || err.code || "card_declined",
        customer: customer?.id,
        paymentIntent: (err.payment_intent as { id?: string } | undefined)?.id ?? paymentIntent?.id,
        message: err.message,
      };
    }
    return { outcome: "error", provider: "stripe", customer: customer?.id, message: err.message };
  }
}
