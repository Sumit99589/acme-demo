"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { currentUser, simContext, track } from "@/lib/client";

const CARDS = [
  ["pm_card_visa", "Visa ending 4242"],
  ["pm_card_mastercard", "Mastercard ending 4444"],
  ["pm_card_chargeDeclined", "Visa ending 0002 (declines)"],
  ["pm_card_chargeDeclinedInsufficientFunds", "Visa ending 9995 (insufficient funds)"],
] as const;

export function CheckoutForm() {
  const [pm, setPm] = useState<string>(CARDS[0][0]);
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");
  const [message, setMessage] = useState("");
  const startedFor = useRef(false);

  useEffect(() => {
    if (startedFor.current) return;
    startedFor.current = true;
    track("checkout_started", { plan: "pro", amount_cents: 1200 });
  }, []);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    const user = currentUser();
    if (!user) {
      setState("failed");
      setMessage("Please create an account first.");
      return;
    }
    const q = new URLSearchParams(window.location.search).get("pm");
    const method = q || pm;
    setState("busy");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: user.id, email: user.email, payment_method: method, ...simContext() }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.outcome === "succeeded") {
      track("payment_succeeded", { plan: "pro", amount_cents: 1200 });
      setState("done");
    } else {
      track("payment_failed", { decline_code: data.decline_code ?? data.error ?? "error" });
      setState("failed");
      setMessage(
        data.decline_code === "insufficient_funds"
          ? "Your card has insufficient funds."
          : "Your card was declined. Try another card.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-6" data-testid="checkout-success">
        <h2 className="text-xl font-semibold">You&rsquo;re on Pro 🎉</h2>
        <p className="mt-1 text-ink/70">Your team now has decision records and full history.</p>
        <Link href="/" className="mt-4 inline-block font-medium underline">
          Back to Acme Notes
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={pay} className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">
          Card <span className="ml-1 rounded bg-accent/10 px-1.5 py-0.5 text-xs text-accent">Stripe test mode</span>
        </legend>
        {CARDS.map(([id, label]) => (
          <label key={id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 bg-white p-3.5">
            <input type="radio" name="pm" value={id} checked={pm === id} onChange={() => setPm(id)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      {state === "failed" && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="checkout-error">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "busy"}
        className="w-full rounded-xl bg-ink px-4 py-3.5 font-medium text-paper disabled:opacity-60"
      >
        {state === "busy" ? "Processing…" : "Pay $12.00 and upgrade"}
      </button>
    </form>
  );
}
