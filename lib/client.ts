"use client";

type WD = {
  init(o: Record<string, unknown>): void;
  track(name: string, props?: Record<string, unknown>): void;
  identify(id: string): void;
  flush(beacon?: boolean): void;
};

declare global {
  interface Window {
    whydunit?: WD;
  }
}

export function track(name: string, props: Record<string, unknown> = {}) {
  window.whydunit?.track(name, props);
}

export function identify(id: string) {
  window.whydunit?.identify(id);
}

/** Simulator traffic arrives with ?wd_synthetic=1&wd_country=XX; remember it for the visit. */
export function simContext(): { synthetic: boolean; country?: string } {
  if (typeof window === "undefined") return { synthetic: false };
  const q = new URLSearchParams(window.location.search);
  if (q.get("wd_synthetic") === "1") {
    const ctx = { synthetic: true, country: q.get("wd_country")?.toUpperCase() || undefined };
    sessionStorage.setItem("acme_sim", JSON.stringify(ctx));
    return ctx;
  }
  try {
    return JSON.parse(sessionStorage.getItem("acme_sim") || "") as { synthetic: boolean; country?: string };
  } catch {
    return { synthetic: false };
  }
}

export interface AcmeUser {
  id: string;
  email: string;
  name: string;
}

export function currentUser(): AcmeUser | null {
  try {
    return JSON.parse(sessionStorage.getItem("acme_user") || "") as AcmeUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(u: AcmeUser) {
  sessionStorage.setItem("acme_user", JSON.stringify(u));
}
