import type { AuditScores } from "@/lib/audit/types";

const SEVERITY_STYLES = {
  critical: "border-red-300 bg-red-50 text-red-900",
  high: "border-amber-300 bg-amber-50 text-amber-900",
  medium: "border-zinc-300 bg-zinc-50 text-zinc-800",
  low: "border-zinc-200 bg-white text-zinc-700",
} as const;

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
    name: "Phase II — Website + AI Bundle",
    price: "$2,000",
    tagline:
      "Custom site, AI chatbot or receptionist, SEO, and source-code ownership.",
  },
  founding_partnership: {
    name: "Founding Partnership",
    price: "$5,000",
    tagline:
      "Phase I + Phase II + receptionist + 4 months of ops support through Aug 31.",
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16 print:max-w-none print:py-0">
      <header className="border-b border-zinc-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#4B9CD3]">
          Modernization audit
        </p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-[#13294B] sm:text-4xl">
          {businessName}
        </h1>
        <p className="mt-3 text-pretty text-base leading-relaxed text-zinc-700">
          {scores.one_line_summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Download as PDF
          </button>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-[#13294B]">Presence score</h2>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-6xl font-bold tracking-tight text-[#13294B]">
            {scores.presence_score}
          </span>
          <span className="pb-3 text-zinc-500">/ 100</span>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(scores.pillar_scores).map(([k, v]) => (
            <div
              key={k}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2.5"
            >
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                {k}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-[#13294B]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#13294B]">What we found</h2>
        <ul className="mt-4 space-y-3">
          {scores.gaps.map((g, i) => (
            <li
              key={i}
              className={`rounded-md border px-4 py-3 ${SEVERITY_STYLES[g.severity]}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{g.title}</h3>
                <span className="text-xs uppercase tracking-wide opacity-75">
                  {g.severity}
                </span>
              </div>
              <p className="mt-1 text-sm">{g.evidence}</p>
              <p className="mt-1 text-sm font-medium">Impact: {g.impact}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-lg border-2 border-[#13294B] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#4B9CD3]">
          Recommended package
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[#13294B]">
          {pkg.name}
        </h2>
        <p className="mt-1 text-3xl font-bold text-[#13294B]">{pkg.price}</p>
        <p className="mt-3 text-pretty text-zinc-700">{pkg.tagline}</p>
        <ul className="mt-4 space-y-1 text-sm text-zinc-700">
          {scores.tsd_services.map((s, i) => (
            <li key={i}>
              <span className="font-medium text-[#13294B]">
                {prettyService(s.service)}.
              </span>{" "}
              {s.rationale}
            </li>
          ))}
        </ul>
        <a
          href="mailto:hello@tsd-modernization.com?subject=Booking%20discovery%20call"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-[#13294B] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f1f3a] print:hidden"
        >
          Book a 20-minute discovery call
        </a>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#13294B]">The full read</h2>
        <div className="prose prose-zinc mt-4 max-w-none whitespace-pre-wrap text-zinc-800">
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
