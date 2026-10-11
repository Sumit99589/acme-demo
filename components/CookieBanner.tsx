"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading consent needs the browser
      setOpen(localStorage.getItem("acme_cookies") === null);
    } catch {
      setOpen(true);
    }
  }, []);
  if (!open) return null;
  const choose = (v: "all" | "essential") => {
    try {
      localStorage.setItem("acme_cookies", v);
    } catch {}
    setOpen(false);
  };
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="cookie-banner fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-ink/10 bg-paper/95 p-4 text-sm shadow-lg backdrop-blur sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-ink/80">
        We use a few cookies to keep you signed in and to understand which pages help. No ad tracking.
      </p>
      <div className="flex gap-2">
        <button onClick={() => choose("essential")} className="rounded-lg px-3 py-2 text-ink/70 hover:bg-ink/5">
          Essential only
        </button>
        <button onClick={() => choose("all")} className="rounded-lg bg-ink px-3 py-2 font-medium text-paper">
          Accept
        </button>
      </div>
    </div>
  );
}
