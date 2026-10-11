"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { simContext, track } from "@/lib/client";

export function HelpForm() {
  const [sent, setSent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        email: f.get("email"),
        subject: f.get("subject"),
        message: f.get("message"),
        synthetic: simContext().synthetic,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not send");
    track("support_contacted", { subject: String(f.get("subject") || "").slice(0, 80) });
    setSent(data.ticket_id);
  }

  if (sent) {
    return (
      <p className="rounded-2xl border border-sage/30 bg-sage/10 p-5" data-testid="help-sent">
        Thanks! Ticket #{sent} is with our team. We usually reply within a day.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Name" name="name" />
      <Field label="Email" name="email" type="email" required />
      <Field label="Subject" name="subject" />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">What happened?</span>
        <textarea
          name="message"
          required
          minLength={5}
          rows={5}
          className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 outline-none focus:border-ink/40"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="rounded-xl bg-ink px-5 py-3 font-medium text-paper">
        Send message
      </button>
    </form>
  );
}
