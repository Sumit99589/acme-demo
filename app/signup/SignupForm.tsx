"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Field } from "@/components/Field";
import { identify, setCurrentUser, simContext, track } from "@/lib/client";

export function SignupForm() {
  const router = useRouter();
  const started = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("signup_started", { form: "signup" });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    markStarted();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, ...simContext() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      identify(data.user_id);
      setCurrentUser({ id: data.user_id, email, name });
      track("signup_completed", { user_id: data.user_id });
      router.push("/onboarding");
    } catch (err) {
      setError((err as Error).message);
      track("signup_error", { message: (err as Error).message.slice(0, 120) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} onFocus={markStarted} className="space-y-4" data-testid="signup-form">
      <Field label="Your name" name="name" autoComplete="name" required minLength={2} />
      <Field label="Work email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-ink px-4 py-3.5 font-medium text-paper hover:bg-ink/85 disabled:opacity-60"
      >
        {busy ? "Creating your workspace…" : "Create account"}
      </button>
      <p className="text-center text-xs text-ink/50">Free for 3 members. No card needed.</p>
    </form>
  );
}
