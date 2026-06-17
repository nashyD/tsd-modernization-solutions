import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { listBusinesses } from "@/lib/demos/businesses";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AI Concierge demos",
  description:
    "Live AI concierge demos built by TSD Modernization Solutions for local businesses.",
  robots: { index: false, follow: false },
};

export default function DemosGallery() {
  const businesses = listBusinesses();
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-2.5">
          <Logo height={20} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </div>
        <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Sparkles size={13} aria-hidden /> Live AI concierge demos
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Concierge demos
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-muted)]">
          Each one is a working AI assistant trained on a real local
          business&rsquo;s own information. Open one and ask it anything a
          customer would.
        </p>
      </header>

      {businesses.length === 0 ? (
        <p className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text-muted)]">
          No demos published yet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {businesses.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/demos/${b.slug}`}
                className="group flex h-full items-start gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--accent)]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ background: b.accent }}
                  aria-hidden
                >
                  {b.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text)]">{b.company}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {b.industry} · {b.town}, NC
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">
                    {b.tagline}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-[var(--text-subtle)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
