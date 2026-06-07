import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EstimateServiceKey } from "@/lib/supabase/types";
import { approveCandidate, rejectCandidate } from "../actions";

export const dynamic = "force-dynamic";

const PRODUCT_LABEL: Record<EstimateServiceKey, string> = {
  website: "Website",
  front_desk: "AI Receptionist",
  booking_bridge: "Booking",
  concierge: "Concierge",
};

export default async function CandidatesPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospect_candidates")
    .select(
      "id,business_name,city,website,phone,rating,review_count,primary_product,gap_summary,fit_score",
    )
    .eq("status", "pending")
    .order("fit_score", { ascending: false })
    .limit(300);
  const rows = data ?? [];

  return (
    <div className="space-y-6 animate-fade-up">
      <Link
        href="/sales"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ChevronLeft size={16} /> Board
      </Link>
      <PageHeader
        eyebrow="Sales · Discovery"
        title={`Candidates${rows.length ? ` · ${rows.length}` : ""}`}
        description="Harvested by the Places sweep, ranked by fit. Approve to add to the pipeline (with its product + gap), or reject."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No candidates to review"
          description="Run the discovery harvester (scripts/discover-prospects.mjs) to populate this list."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((c) => {
            const meta = [
              c.city,
              c.rating
                ? `${c.rating}★${c.review_count ? ` (${c.review_count})` : ""}`
                : null,
              c.fit_score != null ? `fit ${c.fit_score}` : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <li
                key={c.id}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[var(--text)]">
                        {c.business_name}
                      </p>
                      {c.primary_product ? (
                        <span className="rounded-full border border-[var(--accent)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                          {PRODUCT_LABEL[c.primary_product]}
                        </span>
                      ) : null}
                    </div>
                    {c.gap_summary ? (
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {c.gap_summary}
                      </p>
                    ) : null}
                    {meta ? (
                      <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                        {meta}
                      </p>
                    ) : null}
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
                      >
                        <ExternalLink size={12} /> {c.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[var(--text-subtle)]">
                        no website
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <form action={rejectCandidate}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--text)] hover:text-[var(--text)]">
                        Reject
                      </button>
                    </form>
                    <form action={approveCandidate}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-md bg-[var(--accent)] px-3.5 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        Approve →
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
