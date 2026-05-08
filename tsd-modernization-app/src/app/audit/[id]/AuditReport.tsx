import {
  AlertOctagon,
  AlertTriangle,
  Info,
  Sparkle,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { AuditScores } from "@/lib/audit/types";
import { PACKAGES } from "@/lib/packages";
import PrintButton from "./PrintButton";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";

const SEVERITY_META: Record<
  AuditScores["gaps"][number]["severity"],
  { tone: "red" | "amber" | "neutral"; icon: typeof Info }
> = {
  critical: { tone: "red", icon: AlertOctagon },
  high: { tone: "amber", icon: AlertTriangle },
  medium: { tone: "neutral", icon: Info },
  low: { tone: "neutral", icon: Info },
};

export default function AuditReport({
  businessName,
  scores,
  reportMd,
}: {
  businessName: string;
  scores: AuditScores;
  reportMd: string;
}) {
  const pkg = PACKAGES[scores.recommended_package];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16 animate-fade-up print:max-w-none print:py-0">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mb-8 inline-flex items-center gap-2.5 transition-opacity hover:opacity-80 print:hidden"
        aria-label="Back to TSD Modernization Solutions"
      >
        <Logo height={22} />
        <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
          TSD Modernization Solutions
        </span>
      </a>
      <header className="border-b border-[var(--border)] pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Modernization audit
        </p>
        <h1 className="mt-2 font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-[44px]">
          {businessName}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-[var(--text-muted)]">
          {scores.one_line_summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
          <PrintButton />
          <LinkButton variant="ghost" size="sm" href="/audit">
            Run another
          </LinkButton>
        </div>
      </header>

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          Presence score
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-7xl font-semibold leading-none tracking-tight text-[var(--text)]">
            {scores.presence_score}
          </span>
          <span className="pb-3 text-[var(--text-subtle)]">/ 100</span>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(scores.pillar_scores).map(([k, v]) => (
            <div key={k} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                {k}
              </dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
          What we found
        </h2>
        <ul className="mt-5 space-y-3">
          {scores.gaps.map((g, i) => {
            const meta = SEVERITY_META[g.severity];
            const Icon = meta.icon;
            return (
              <li
                key={i}
                className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                        g.severity === "critical"
                          ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                          : g.severity === "high"
                            ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                            : "bg-[var(--surface-2)] text-[var(--text-subtle)]"
                      }`}
                    >
                      <Icon size={15} strokeWidth={2} aria-hidden />
                    </span>
                    <h3 className="font-semibold text-[var(--text)]">
                      {g.title}
                    </h3>
                  </div>
                  <Badge tone={meta.tone}>{g.severity}</Badge>
                </div>
                {g.evidence && (
                  <p className="mt-3 pl-10 text-sm leading-relaxed text-[var(--text-muted)]">
                    {g.evidence}
                  </p>
                )}
                {g.impact && (
                  <p className="mt-2 pl-10 text-sm leading-relaxed text-[var(--text)]">
                    <span className="font-medium">Impact: </span>
                    {g.impact}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Premium-offer recommended-package card */}
      <section className="relative mt-14 overflow-hidden rounded-[18px] border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-2)] p-8 shadow-[var(--shadow-glow)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[var(--navy-soft)] blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <Sparkle size={12} strokeWidth={2.25} aria-hidden />
              Recommended package
            </span>
            {pkg.cap && <Badge tone="navy">{pkg.cap}</Badge>}
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {pkg.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-5xl font-bold tracking-tight text-[var(--text)]">
              {pkg.price}
            </span>
            {pkg.anchor && (
              <span className="text-base text-[var(--text-subtle)] line-through">
                {pkg.anchor}
              </span>
            )}
          </div>

          <p className="mt-3 text-pretty leading-relaxed text-[var(--text-muted)]">
            {pkg.tagline}
          </p>

          <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
            {scores.tsd_services.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                <span>
                  <span className="font-semibold text-[var(--text)]">
                    {prettyService(s.service)}.
                  </span>{" "}
                  {s.rationale}
                </span>
              </li>
            ))}
          </ul>

          {(pkg.guarantee || true) && (
            <div className="mt-7 grid gap-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4 text-sm text-[var(--text-muted)] sm:grid-cols-2">
              {pkg.guarantee && (
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 flex-none text-[var(--success)]"
                    aria-hidden
                  />
                  <span>
                    <span className="font-semibold text-[var(--text)]">
                      Guarantee.
                    </span>{" "}
                    {pkg.guarantee}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <Clock
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 flex-none text-[var(--accent)]"
                  aria-hidden
                />
                <span>
                  <span className="font-semibold text-[var(--text)]">
                    Cohort closes Aug 10, 2026.
                  </span>{" "}
                  Last project start is July 13.
                </span>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
            <LinkButton
              href="https://tsd-modernization.com/book"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              rightIcon={<ArrowRight size={16} strokeWidth={2.25} />}
            >
              Book a free fit call
            </LinkButton>
            <LinkButton
              variant="ghost"
              size="lg"
              href="https://tsd-modernization.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
            >
              See all packages
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
          The full read
        </h2>
        <div className="mt-4 whitespace-pre-wrap text-pretty text-base leading-relaxed text-[var(--text-muted)]">
          {reportMd}
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-subtle)]">
        Generated by TSD Modernization Solutions — a Charlotte-area AI &amp;
        web modernization team running a Founding Cohort through Aug 10, 2026.
      </footer>
    </main>
  );
}

function prettyService(s: AuditScores["tsd_services"][number]["service"]) {
  switch (s) {
    case "website_rebuild":
      return "Website rebuild";
    case "ai_chatbot":
      return "AI chatbot";
    case "ai_receptionist":
      return "AI receptionist";
    case "automation":
      return "Workflow automation";
    case "seo_local":
      return "Local SEO";
    case "review_management":
      return "Review management";
    case "audit_only":
      return "Discovery audit";
  }
}
