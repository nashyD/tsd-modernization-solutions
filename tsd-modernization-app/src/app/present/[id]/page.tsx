import { notFound } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { requireRole } from "@/lib/auth/require";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import {
  SiteCard,
  OutlineCard,
  AssetsCard,
  ProofCard,
  ProblemCard,
} from "@/app/sales/_components/ShowcaseSections";
import PitchBody from "@/app/sales/_components/PitchBody";
import BookCallCard from "@/app/sales/_components/BookCallCard";
import { calendlyUrlFor } from "@/lib/sales/calendly";
import { PresentModeNote } from "@/app/sales/_components/PitchNotes";
import VoiceWidget from "@/app/app/voice/VoiceWidget";
import { Logo } from "@/components/ui/Logo";
import { DEFAULT_SIZE } from "@/lib/sales/estimator";

export const dynamic = "force-dynamic";

// Full-screen, TSD-branded "present mode" — what the client sees when the iPad
// is handed over. No internal nav (it lives outside /sales), no status pills, no
// edit controls; just the branded demo, live build estimate, value, and booking.
// One discreet exit returns to the work page or the field queue.
export default async function PresentPitch({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;
  const { from } = await searchParams;
  // When launched from the field tool, Exit returns to the queue, not the work page.
  const exitHref = from === "next" ? "/sales/next" : `/sales/${id}`;
  const showcase = await loadShowcaseById(id);
  if (!showcase) notFound();
  const { prospect, estimates, assets } = showcase;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* TSD brand bar + discreet exit + rep-only note control */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2.5">
          <Logo height={22} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </span>
        <div className="flex items-center gap-1">
          <PresentModeNote prospectId={prospect.id} />
          <Link
            href={exitHref}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <X size={14} aria-hidden /> Exit pitch
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          A modernization plan prepared for
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text)]">
          {prospect.business_name}
        </h1>
      </header>

      <div className="space-y-6">
        {/* Proof — a real, live TSD build (anchors credibility for cold prospects) */}
        <ProofCard />

        {/* Problem — make the cost of the gap vivid before the price */}
        <ProblemCard product={prospect.primary_product} />

        {/* 1 — Demo website */}
        <SiteCard url={prospect.demo_site_url} />

        {/* Live AI receptionist demo, if configured */}
        {prospect.vapi_assistant_id && (
          <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Your AI receptionist — live demo
            </h2>
            <VoiceWidget assistantId={prospect.vapi_assistant_id} />
          </section>
        )}

        {/* 2 — Service picker → 3 — value → 4 — book call → optional deposit */}
        <PitchBody
          prospectId={prospect.id}
          initialSize={prospect.team_size || DEFAULT_SIZE}
          initialServices={prospect.selected_services ?? []}
          depositPct={prospect.deposit_pct ?? 10}
          estimates={estimates}
        >
          <BookCallCard
            name={prospect.contact_name}
            email={prospect.email}
            url={calendlyUrlFor(prospect.owner)}
          />
          <OutlineCard md={prospect.outline_md} />
          <AssetsCard assets={assets} />
        </PitchBody>
      </div>

      {/* Branded sign-off */}
      <footer className="mt-10 border-t border-[var(--border)] pt-6 text-center">
        <span className="inline-flex items-center gap-2 text-[var(--text-subtle)]">
          <Logo height={16} />
          <span className="text-xs">
            TSD Modernization Solutions · Charlotte, NC
          </span>
        </span>
      </footer>
    </div>
  );
}
