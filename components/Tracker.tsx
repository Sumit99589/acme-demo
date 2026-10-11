"use client";

import Script from "next/script";
import { simContext } from "@/lib/client";

export function Tracker() {
  const key = process.env.NEXT_PUBLIC_WHYDUNIT_KEY;
  if (!key) return null;
  return (
    <Script
      src="/whydunit.js"
      strategy="afterInteractive"
      onLoad={() => {
        simContext();
        window.whydunit?.init({
          key,
          endpoint: "/api/wd",
          replaySampleRate: Number(process.env.NEXT_PUBLIC_WHYDUNIT_REPLAY_RATE ?? "0.2"),
        });
      }}
    />
  );
}
