import Link from "next/link";
import { Phone } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { fitBand, fitLabel, FIT_BAND_TONE } from "@/lib/sales/fit";
import type { ProspectStatus } from "@/lib/supabase/types";
import DispositionBar from "../_components/DispositionBar";

export const dynamic = "force-dynamic";

// Cold-call practice queue. Lists prospects LOWEST fit first so a rep (Bishop)
// can warm up on throwaway leads without spending a high-potential one. Calls
// here still log a real disposition, so the reps and the funnel both benefit.

const STATUS_LABEL: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_shown: "Demo shown",
  fit_call: "Fit call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

type Row = {
  id: string;
  business_name: string;
  status: ProspectStatus;
  fit_score: number | null;
  gap_summary: string | null;
  city: string | null;
  phone: string | null;
  contact_name: string | null;
};

export default async function PracticeQueue() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospects")
    .select(
      "id,business_name,status,fit_score,gap_summary,city,phone,contact_name",
    )
    .not("status", "in", "(won,lost)")
    .order("fit_score", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(50);
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Practice queue"
        description="Lowest-fit leads first. Warm up your cold-calling here, so a rough call lands on a throwaway lead instead of a high-potential one. Every call still logs as a real touch."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No prospects to practice on"
          description="Add or seed prospects, then run the fit-score backfill so the lowest-fit ones surface here."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((p, i) => {
            const band = fitBand(p.fit_score);
            const leak = p.gap_summary || p.city || "";
            return (
              <li
                key={p.id}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-[var(--text-subtle)]">
                        {i + 1}
                      </span>
                      <Link
                        href={`/sales/${p.id}`}
                        className="font-semibold text-[var(--text)] hover:text-[var(--accent)]"
                      >
                        {p.business_name}
                      </Link>
                      <Badge tone={FIT_BAND_TONE[band]}>
                        {fitLabel(p.fit_score)}
                      </Badge>
                      <Badge tone="neutral">{STATUS_LABEL[p.status]}</Badge>
                    </div>
                    {leak ? (
                      <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                        {leak}
                      </p>
                    ) : null}
                    {p.contact_name ? (
                      <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                        Ask for {p.contact_name}
                      </p>
                    ) : null}
                  </div>
                  {p.phone ? (
                    <a
                      href={`tel:${p.phone}`}
                      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      <Phone size={14} /> {p.phone}
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-[var(--text-subtle)]">
                      no phone
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <DispositionBar prospectId={p.id} channel="call" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
