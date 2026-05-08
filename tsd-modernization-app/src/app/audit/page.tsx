import type { Metadata } from "next";
import AuditForm from "./AuditForm";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, Sparkles, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Free online presence audit · TSD Modernization Solutions",
  description:
    "Get a no-cost audit of your business's website, Google profile, and online presence. We'll find the gaps and tell you what they're costing you.",
};

const TRUST_BULLETS = [
  { icon: Clock, text: "Report in your inbox in under a minute" },
  { icon: ShieldCheck, text: "We never share your data" },
  { icon: Sparkles, text: "Powered by Claude AI" },
];

export default function AuditPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-12 sm:py-16">
      <header className="mb-10 animate-fade-up">
        {/* Plain <a> — `/` is a Vercel rewrite to the marketing Vite app, not a
            Next route. <Link> would client-side route into this app's / handler
            (which redirects to /audit) instead of bouncing to the marketing site. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="mb-7 inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Back to TSD Modernization Solutions"
        >
          <Logo height={26} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </a>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Free presence audit
        </p>
        <h1 className="mt-2 text-balance font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-[44px]">
          See exactly what your online presence is costing you.
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          Tell us your business and we&apos;ll grade the five things that
          decide whether a customer hires you or your competitor: website,
          Google profile, reviews, trust signals, and conversion paths.
        </p>
      </header>

      <div className="animate-fade-up-d100">
        <AuditForm />
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-3 animate-fade-up-d200">
        {TRUST_BULLETS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2">
            <Icon
              size={16}
              strokeWidth={1.75}
              className="flex-none text-[var(--accent)]"
              aria-hidden
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs leading-relaxed text-[var(--text-subtle)] animate-fade-up-d300">
        We&apos;ll only use the phone number to follow up if you ask us to.
      </p>
    </div>
  );
}
