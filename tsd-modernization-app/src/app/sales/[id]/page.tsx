import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import {
  SiteCard,
  EstimatesCard,
  OutlineCard,
  AssetsCard,
} from "../_components/ShowcaseSections";
import DepositPanel from "../_components/DepositPanel";
import PitchActions from "./PitchActions";
import VoiceWidget from "@/app/app/voice/VoiceWidget";
import BackLink from "@/components/BackLink";
import { env } from "@/lib/env";

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

  return (
    <div className="space-y-6 animate-fade-up">
      <BackLink href="/sales" label="All prospects" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
            {prospect.business_name}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {prospect.business_url}
          </p>
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

      <SiteCard url={prospect.demo_site_url} />
      {prospect.vapi_assistant_id && (
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Your AI receptionist — live demo
          </h2>
          <VoiceWidget assistantId={prospect.vapi_assistant_id} />
        </section>
      )}
      <EstimatesCard estimates={estimates} />
      <OutlineCard md={prospect.outline_md} />
      <AssetsCard assets={assets} />
      {prospect.deposit_target > 0 && (
        <DepositPanel
          prospectId={prospect.id}
          targetDollars={Number(prospect.deposit_target)}
        />
      )}
    </div>
  );
}
