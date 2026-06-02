import { notFound } from "next/navigation";
import { loadShowcaseByToken } from "@/lib/sales/load-showcase";
import {
  SiteCard,
  EstimatesCard,
  OutlineCard,
  AssetsCard,
} from "@/app/sales/_components/ShowcaseSections";
import PitchBody from "@/app/sales/_components/PitchBody";
import BookCallCard from "@/app/sales/_components/BookCallCard";
import PublicVoiceCard from "@/app/sales/_components/PublicVoiceCard";
import { DEFAULT_SIZE } from "@/lib/sales/estimator";

export const dynamic = "force-dynamic";

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const showcase = await loadShowcaseByToken(token);
  if (!showcase) notFound();
  const { prospect, estimates, assets } = showcase;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
          {prospect.business_name}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Prepared for you by TSD Modernization Solutions
        </p>
      </header>
      <div className="space-y-6">
        {/* 1 — Demo website */}
        <SiteCard url={prospect.demo_site_url} />
        {prospect.vapi_assistant_id && <PublicVoiceCard token={prospect.share_token} />}

        {/* 2 — Service picker → 3 — estimates → 4 — book call → optional deposit */}
        <PitchBody
          token={prospect.share_token}
          initialSize={prospect.team_size || DEFAULT_SIZE}
          initialServices={prospect.selected_services ?? []}
          depositPct={prospect.deposit_pct ?? 10}
        >
          <EstimatesCard estimates={estimates} />
          <BookCallCard name={prospect.contact_name} email={prospect.email} />
          <OutlineCard md={prospect.outline_md} />
          <AssetsCard assets={assets} />
        </PitchBody>
      </div>
    </div>
  );
}
