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
import { Logo } from "@/components/ui/Logo";
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
      <header className="mb-8">
        <span className="inline-flex items-center gap-2.5">
          <Logo height={22} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </span>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          A modernization plan prepared for
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
          {prospect.business_name}
        </h1>
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
