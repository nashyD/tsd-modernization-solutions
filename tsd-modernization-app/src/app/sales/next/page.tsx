import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NextNearby } from "./NextNearby";
import { QuickAdd } from "../_components/QuickAdd";

export const dynamic = "force-dynamic";

export default async function NextNearbyPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospects")
    .select(
      "id,business_name,business_url,phone,city,lat,lng,place_id,status,primary_product,gap_summary,rating,review_count,notes",
    )
    .in("status", ["new", "pitched"])
    .order("updated_at", { ascending: false });
  const active = data ?? [];
  const located = active
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ ...p, lat: p.lat as number, lng: p.lng as number }));
  const missing = active.length - located.length;

  return (
    <div className="space-y-6 animate-fade-up">
      <Link
        href="/sales"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ChevronLeft size={16} /> Board
      </Link>
      <PageHeader
        eyebrow="Sales · Field"
        title="Next prospect near you"
        description="Sorted by distance from where you are. Get directions, pitch on the spot, then mark the visit."
      />
      <QuickAdd />
      {located.length === 0 ? (
        <EmptyState
          title="No located prospects yet"
          description={
            missing > 0
              ? `${missing} active prospect${missing === 1 ? "" : "s"} still need coordinates before they can be routed.`
              : "Add prospects with a location to use the field tool."
          }
        />
      ) : (
        <NextNearby prospects={located} missing={missing} />
      )}
    </div>
  );
}
