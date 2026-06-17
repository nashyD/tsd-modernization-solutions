import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Clock, PhoneCall, Sparkles } from "lucide-react";
import { getBusiness, allSlugs } from "@/lib/demos/businesses";
import { Logo } from "@/components/ui/Logo";
import Concierge from "../_components/Concierge";

export const dynamic = "force-static";

const BOOK_URL = "https://www.tsd-modernization.com/book";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return { title: "Concierge demo" };
  const title = `${b.company} — AI Concierge demo`;
  const description = `A live AI concierge demo built by TSD Modernization Solutions for ${b.company} in ${b.town}, NC. Ask it anything a customer would.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website" },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) notFound();

  const valueProps = [
    {
      icon: Clock,
      title: "Answers 24/7",
      body: "Customers get instant answers at midnight or during the lunch rush — no missed messages.",
    },
    {
      icon: MessageSquare,
      title: "Only the real facts",
      body: `Every reply is grounded in ${b.company}'s own information and cites its source. No making things up.`,
    },
    {
      icon: PhoneCall,
      title: "Fewer repeat calls",
      body: "The same questions about hours, pricing, and booking get handled automatically.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-7">
        <div className="flex items-center gap-2.5">
          <Logo height={20} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </div>
        <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Sparkles size={13} aria-hidden /> Live AI concierge · built for
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {b.company}
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-base leading-relaxed text-[var(--text-muted)]">
          {b.industry} · {b.town}, NC. Ask it anything a customer would — it
          answers only from {b.company}&rsquo;s real information.
        </p>
      </header>

      <Concierge
        slug={b.slug}
        company={b.company}
        accent={b.accent}
        glyph={b.glyph}
        greeting={b.greeting}
        starterChips={b.starterChips}
        bookUrl={BOOK_URL}
      />

      {/* Why it matters */}
      <section className="mt-8 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Why this matters for {b.company}
        </p>
        <p className="mt-2 text-pretty leading-relaxed text-[var(--text)]">
          {b.gap}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {valueProps.map((v) => (
            <div key={v.title}>
              <v.icon size={18} className="text-[var(--accent)]" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                {v.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-6 flex flex-col items-start gap-3 rounded-[14px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-[var(--text)]">
            Want one of these on your site?
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            We can have it live and trained on your real info in days.
          </p>
        </div>
        <a
          href={BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 text-sm font-semibold text-[var(--primary-fg)] transition-colors hover:bg-[var(--primary-bg-hover)]"
        >
          Book a free fit call
        </a>
      </section>

      <footer className="mt-8 border-t border-[var(--border)] pt-6">
        <Link
          href="/demos"
          className="text-xs font-medium text-[var(--text-subtle)] transition-colors hover:text-[var(--accent)]"
        >
          ← All concierge demos
        </Link>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-subtle)]">
          Concept demo built by TSD Modernization Solutions to show what an AI
          concierge could do for {b.company}. Answers draw only from publicly
          available information and may be incomplete or out of date. Not
          affiliated with or endorsed by {b.company}.
        </p>
      </footer>
    </main>
  );
}
