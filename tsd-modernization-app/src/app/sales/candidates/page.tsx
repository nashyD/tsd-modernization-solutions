import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { CandidateList, type Candidate } from "./CandidateList";

export const dynamic = "force-dynamic";

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
  const rows = (data ?? []) as Candidate[];

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
      <CandidateList initial={rows} />
    </div>
  );
}
