import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Grant's field playbook. Content mirrors the canonical page in the TSD operating
 * wiki (wiki/plays/sales-playbook.md), which is generated from the A.B. Carter
 * Grant brief + the play pages and refreshed via /refresh-vault. Server component
 * — anchor links + <details> give the accordion/jump-nav with no client JS.
 */

const SELLS: { name: string; desc: string }[] = [
  { name: "TSD Front Desk", desc: "AI receptionist — answers every call, books, and routes. Never miss a lead." },
  { name: "TSD Concierge", desc: "RAG site assistant — answers from the client's own docs, forced to cite or defer." },
  { name: "TSD Lead Engine", desc: "Lead-capture funnels — the gallantrenters motion, productized." },
  { name: "Custom Websites", desc: "The modern site itself." },
];

const ICP: string[] = [
  "Established, reputation-rich, ample cash, with one verified product gap.",
  "Gate: operational · ≥4.0★ · ≥40 reviews · independent. 279 clean Gaston independents already staged.",
  'We displace do-nothing / DIY (Weebly, Wix, GoDaddy). Reframe "do nothing" as "keep paying the leak."',
];

const MOTION: { t: string; d: string }[] = [
  { t: "Demo-first", d: "Build their own site or assistant before the pitch. Removes the imagination gap." },
  { t: "Run it on the iPad", d: "Prospect card → their website (+ scan-to-phone QR), a live receptionist demo, and dollar estimates." },
  { t: "Free 30-min fit call", d: "Open with the Cost-Cut Audit — read their recurring spend, find the leak, put a monthly number on it." },
  { t: "Estimator intake", d: 'Prices the deliverable; the "How should it run?" step picks Managed vs Owned.' },
  { t: "Close on the spot", d: "Square deposit panel flips the prospect → won. Deposit before any full build. Written proposal within 48 hours." },
];

const DISCOVERY: string[] = [
  "Who handles this today, in which languages, and roughly how many per week?",
  "Where does the data live, and can it export a CSV? (This gates a Concierge POC.)",
  "Who runs the website — internal or an agency?",
  "What happens today in the edge case — an after-hours call, a photo of a worn part, a question the team can't answer fast?",
  "If a pilot proves out, who has to say yes — and does a scoped, deposit-first pilot fit how you buy?",
];

const OBJECTIONS: { q: string; a: string }[] = [
  {
    q: '"One more thing for us to manage / you build it and walk away."',
    a: "This killed Sonderwerks. Lead with Managed: we host it, we tune it, and you get a monthly report of what buyers asked. Every account is in your name — you own it all. The objection is a direct argument FOR the recurring relationship.",
  },
  {
    q: '"AI makes things up."',
    a: "The Concierge is architecturally forced to cite or defer — it can't answer outside their own catalog. Show the source deep-link again.",
  },
  {
    q: '"Our customers just call us."',
    a: "True at 2pm local. At 2am across time zones they're reading a PDF. And every question it can't answer becomes a logged lead for the team.",
  },
  {
    q: '"Why pay monthly?"',
    a: "Managed = hosting + maintenance + changes-by-text, domain in your name. Owned exists if you insist on full control or one-time spend (setup ×~1.25, $0/mo). Default to Managed.",
  },
  {
    q: '"Too expensive / not worth it."',
    a: "Anchor on the leak: the realized monthly saving beats the fee. Proof — Cake Me Away, $540/mo cut = $6,480/yr. Use real anonymized numbers only.",
  },
  {
    q: '"We sell through distributors."',
    a: "Distributors sell more when selection is self-serve — and your own team uses it internally from day one.",
  },
];

const PRICING: string[] = [
  'Anchor at or above the last comparable build. In the room: "pilots like this start around where our last catalog build landed."',
  "POC scope: one product line, the core languages, their real data, deposit before work starts.",
  "Every estimator figure is a placeholder until Nash signs off — quote ranges, never hard numbers.",
];

const NAV: { id: string; label: string }[] = [
  { id: "sells", label: "What we sell" },
  { id: "icp", label: "Who we're for" },
  { id: "motion", label: "The motion" },
  { id: "discovery", label: "Discovery Qs" },
  { id: "objections", label: "Objections" },
  { id: "pricing", label: "Pricing" },
  { id: "commission", label: "Commission" },
];

const CARD =
  "rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
      {children}
    </h2>
  );
}

export function PlaybookView() {
  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Playbook"
        description="Everything you need to walk in and close — what we sell, the discovery-to-deposit motion, and the exact answers to the objections you'll hear. Tap an objection to reveal the response."
      />

      {/* Lead-with quick reference */}
      <section className="rounded-[14px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <p className="font-display text-lg font-semibold leading-snug text-[var(--text)]">
          “We find the money your business is leaking — and build what stops it.”
        </p>
        <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
          <p>
            <span className="font-semibold text-[var(--text)]">Lead with Managed.</span>{" "}
            We host + maintain it; their domain, their accounts.
          </p>
          <p>
            <span className="font-semibold text-[var(--text)]">Proof to carry:</span>{" "}
            Bisque Imports — $5,200 + $73/mo, live, delivered 8 days early.
          </p>
        </div>
      </section>

      {/* Jump nav */}
      <nav aria-label="Playbook sections" className="no-scrollbar -mx-1 flex flex-wrap gap-2 px-1">
        {NAV.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* What we sell */}
      <section id="sells" className="scroll-mt-6">
        <SectionTitle>What we sell</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SELLS.map((s) => (
            <li key={s.name} className={CARD}>
              <p className="font-semibold text-[var(--text)]">{s.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{s.desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--text-subtle)]">
          Every deliverable sells two ways — <span className="text-[var(--text-muted)]">Managed</span> (recurring,
          we host + maintain) or <span className="text-[var(--text-muted)]">Owned</span> (one-time handoff, setup
          ×~1.25, $0/mo). Free hook: the Cost-Cut Audit opens the fit call.
        </p>
      </section>

      {/* Who we're for */}
      <section id="icp" className="scroll-mt-6">
        <SectionTitle>Who we&apos;re for</SectionTitle>
        <ul className={`${CARD} space-y-2`}>
          {ICP.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The motion */}
      <section id="motion" className="scroll-mt-6">
        <SectionTitle>Discovery → deposit</SectionTitle>
        <ol className="space-y-3">
          {MOTION.map((m, i) => (
            <li key={i} className={`${CARD} flex gap-4`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-[var(--text)]">{m.t}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-muted)]">{m.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Discovery questions */}
      <section id="discovery" className="scroll-mt-6">
        <SectionTitle>Five questions to leave with answered</SectionTitle>
        <ol className={`${CARD} space-y-3`}>
          {DISCOVERY.map((q, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--text)]">
              <span className="font-bold text-[var(--accent)]">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Objection bank */}
      <section id="objections" className="scroll-mt-6">
        <SectionTitle>Objection bank — tap to reveal</SectionTitle>
        <div className="space-y-2.5">
          {OBJECTIONS.map((o, i) => (
            <details
              key={i}
              className="group rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] open:bg-[var(--surface-2)] sm:p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[var(--text)] [&::-webkit-details-marker]:hidden">
                <span>{o.q}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className="shrink-0 text-[var(--text-subtle)] transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{o.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-6">
        <SectionTitle>Pricing posture</SectionTitle>
        <ul className={`${CARD} space-y-2`}>
          {PRICING.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Commission */}
      <section id="commission" className="scroll-mt-6">
        <SectionTitle>Commission</SectionTitle>
        <div className={CARD}>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Grant/Bishop earn <span className="font-semibold text-[var(--text)]">30% of per-deal gross
            profit on builds</span>; recurring Managed AI is{" "}
            <span className="font-semibold text-[var(--text)]">100% to the Company</span>. The build pays
            commission, the retainer does not.
          </p>
        </div>
      </section>

      <p className="pt-2 text-xs text-[var(--text-subtle)]">
        Canonical source: the TSD operating wiki (plays/sales-playbook). Edited there and mirrored here.
      </p>
    </div>
  );
}
