"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";

// Nash's existing 30-min fit-call event (same as the marketing /book page).
const CALENDLY_URL = "https://calendly.com/nashdavis-tsd-ventures/30min";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }) => void;
    };
  }
}

export default function BookCallCard({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !ref.current || !window.Calendly) return;
      ref.current.innerHTML = "";
      const prefill: { name?: string; email?: string } = {};
      if (name) prefill.name = name;
      if (email) prefill.email = email;
      window.Calendly.initInlineWidget({
        url: `${CALENDLY_URL}?hide_gdpr_banner=1`,
        parentElement: ref.current,
        prefill,
      });
    };
    if (window.Calendly) init();
    else {
      const t = setInterval(() => {
        if (window.Calendly) {
          clearInterval(t);
          init();
        }
      }, 150);
      return () => {
        cancelled = true;
        clearInterval(t);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [name, email]);

  return (
    <section className="rounded-[14px] border border-[var(--accent)]/40 bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        Step 1 — Book your strategy call
      </h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Grab a time with Nash. We&apos;ll walk through your build, answer questions, and lock the exact
        scope and fixed price together. No obligation.
      </p>
      <div className="mt-4 overflow-hidden rounded-[10px] border border-[var(--border)] bg-white">
        <div ref={ref} style={{ minWidth: 320, height: 660 }} />
      </div>
    </section>
  );
}
