import { AlertOctagon, AlertTriangle, Info, Sparkle } from "lucide-react";
import type { AuditScores } from "@/lib/audit/types";
import PrintButton from "./PrintButton";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const SEVERITY_META: Record<
  AuditScores["gaps"][number]["severity"],
  { tone: "red" | "amber" | "neutral"; icon: typeof Info }
> = {
  critical: { tone: "red", icon: AlertOctagon },
  high: { tone: "amber", icon: AlertTriangle },
  medium: { tone: "neutral", icon: Info },
  low: { tone: "neutral", icon: Info },
};

const PACKAGE_COPY: Record<
  AuditScores["recommended_package"],
  { name: string; price: string; tagline: string }
> = {
  discovery_audit: {
    name: "Phase I — Discovery Audit",
    price: "$1,500",
    tagline: "A 2-3 hour structured audit and modernization roadmap.",
  },
  website_ai_bundle: {
    name: "Website + AI Build",
    price: "$5,000",
    tagline:
      "Custom site, AI chatbot or receptionist, SEO, and source-code ownership.",
  },
  founding_partnership: {
    name: "The Full Modernization",
    price: "$10,000",
    tagline:
      "Phase I + Build + receptionist + 4 months of ops support through Aug 31.",
  },
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
  const pkg = PACKAGE_COPY[scores.recommended_package];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16 animate-fade-up print:max-w-none print:py-0">
      <header className="border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4B9CD3]">
          Modernization audit
        </p>
        <h1 className="mt-2 font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-[#13294B] sm:text-[44px]">
          {businessName}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-700">
          {scores.one_line_summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
          <PrintButton />
          <LinkButton
            variant="ghost"
            size="sm"
            href="/audit"
          >
            Run another
          </LinkButton>
        </div>
      </header>

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Presence score
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-7xl font-semibold leading-none tracking-tight text-[#13294B]">
            {scores.presence_score}
          </span>
          <span className="pb-3 text-zinc-400">/ 100</span>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(scores.pillar_scores).map(([k, v]) => (
            <div
              key={k}
              className="rounded-[10px] border border-zinc-200/80 bg-white px-3.5 py-3"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {k}
              </dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold tracking-tight text-[#13294B]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#13294B]">
          What we found
        </h2>
        <ul className="mt-5 space-y-3">
          {scores.gaps.map((g, i) => {
            const meta = SEVERITY_META[g.severity];
            const Icon = meta.icon;
            return (
              <li
                key={i}
                className="rounded-[12px] border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                        g.severity === "critical"
                          ? "bg-red-50 text-red-700"
                          : g.severity === "high"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <Icon size={15} strokeWidth={2} aria-hidden />
                    </span>
                    <h3 className="font-semibold text-[#13294B]">{g.title}</h3>
                  </div>
                  <Badge tone={meta.tone}>{g.severity}</Badge>
                </div>
                {g.evidence && (
                  <p className="mt-3 pl-10 text-sm leading-relaxed text-zinc-700">
                    {g.evidence}
                  </p>
                )}
                {g.impact && (
                  <p className="mt-2 pl-10 text-sm leading-relaxed text-zinc-900">
                    <span className="font-medium">Impact: </span>
                    {g.impact}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14 overflow-hidden rounded-[16px] border-2 border-[#13294B] bg-gradient-to-br from-white via-[#fbfcfe] to-[#eef7fc] p-7 shadow-[0_8px_32px_rgb(19_41_75_/_0.08)]">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#4B9CD3]">
          <Sparkle size={13} strokeWidth={2.25} aria-hidden />
          Recommended package
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#13294B]">
          {pkg.name}
        </h2>
        <p className="mt-1 font-display text-4xl font-bold text-[#13294B]">
          {pkg.price}
        </p>
        <p className="mt-3 text-pretty leading-relaxed text-zinc-700">
          {pkg.tagline}
        </p>
        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-zinc-700">
          {scores.tsd_services.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#4B9CD3]" />
              <span>
                <span className="font-semibold text-[#13294B]">
                  {prettyService(s.service)}.
                </span>{" "}
                {s.rationale}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3 print:hidden">
          <LinkButton
            href="mailto:hello@tsd-modernization.com?subject=Booking%20discovery%20call"
            size="lg"
          >
            Book a 20-minute discovery call
          </LinkButton>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#13294B]">
          The full read
        </h2>
        <div className="mt-4 whitespace-pre-wrap text-pretty text-base leading-relaxed text-zinc-800">
          {reportMd}
        </div>
      </section>

      <footer className="mt-16 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
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
      return "Phase I audit";
  }
}
