import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SiteCard, EstimatesCard, OutlineCard, AssetsCard } from "../_components/ShowcaseSections";
import PitchBody from "../_components/PitchBody";
import BookCallCard from "../_components/BookCallCard";
import PitchActions from "./PitchActions";
import AuditRunner from "./AuditRunner";
import VoiceWidget from "@/app/app/voice/VoiceWidget";
import BackLink from "@/components/BackLink";
import { env } from "@/lib/env";
import { DEFAULT_SIZE } from "@/lib/sales/estimator";
import type { AuditStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PitchView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const showcase = await loadShowcaseById(id);
  if (!showcase) notFound();
  const { prospect, estimates, assets } = showcase;
  const shareUrl = `${env().NEXT_PUBLIC_SITE_URL}/showcase/${prospect.share_token}`;

  // Audit status for the runner (only if one is linked).
  let auditStatus: AuditStatus | null = null;
  if (prospect.audit_id) {
    const { data: audit } = await supabaseAdmin()
      .from("audits")
      .select("status")
      .eq("id", prospect.audit_id)
      .maybeSingle();
    auditStatus = (audit?.status as AuditStatus) ?? null;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <BackLink href="/sales" label="All prospects" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {prospect.business_name}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{prospect.business_url}</p>
        </div>
        <Link
          href={`/sales/${id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <PitchActions
        id={prospect.id}
        status={prospect.status}
        shareEnabled={prospect.share_enabled}
        shareUrl={shareUrl}
      />

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

      {/* 2 — Service picker → 3 — estimates → 4 — book call → optional deposit (last) */}
      <PitchBody
        prospectId={prospect.id}
        initialSize={prospect.team_size || DEFAULT_SIZE}
        initialServices={prospect.selected_services ?? []}
        depositPct={prospect.deposit_pct ?? 10}
      >
        <AuditRunner
          prospectId={prospect.id}
          auditId={prospect.audit_id}
          initialStatus={auditStatus}
        />
        <EstimatesCard estimates={estimates} />
        <BookCallCard name={prospect.contact_name} email={prospect.email} />
        <OutlineCard md={prospect.outline_md} />
        <AssetsCard assets={assets} />
      </PitchBody>
    </div>
  );
}
