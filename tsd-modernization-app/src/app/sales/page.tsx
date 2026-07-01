import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { usd } from "@/lib/sales/services";
import { estimate } from "@/lib/sales/estimator";
import type { ProspectStatus, EstimateServiceKey } from "@/lib/supabase/types";
import { fitBand, fitLabel, FIT_BAND_TONE } from "@/lib/sales/fit";
import { promoteLead } from "./actions";

export const dynamic = "force-dynamic";

const ORDER: ProspectStatus[] = [
  "new",
  "contacted",
  "demo_shown",
  "fit_call",
  "proposal",
  "won",
  "lost",
];
const LABEL: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_shown: "Demo shown",
  fit_call: "Fit call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};
const TONE: Record<ProspectStatus, "amber" | "blue" | "emerald" | "neutral"> = {
  new: "amber",
  contacted: "blue",
  demo_shown: "blue",
  fit_call: "blue",
  proposal: "blue",
  won: "emerald",
  lost: "neutral",
};

// The product we LEAD the pitch with. Same vocabulary as
// prospect_estimates.service_key (see migration 0007_prospect_discovery).
type ProductKey = EstimateServiceKey;
const PRODUCT_LABEL: Record<ProductKey, string> = {
  website: "Website",
  front_desk: "AI Receptionist",
  booking_bridge: "Lead Engine",
  concierge: "Concierge",
};
const PRODUCT_ORDER: ProductKey[] = [
  "website",
  "front_desk",
  "booking_bridge",
  "concierge",
];
function isProductKey(v: string | undefined): v is ProductKey {
  return (
    v === "website" ||
    v === "front_desk" ||
    v === "booking_bridge" ||
    v === "concierge"
  );
}

export default async function SalesBoard({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productParam } = await searchParams;
  const product = isProductKey(productParam) ? productParam : null;

  const sb = supabaseAdmin();
  const { data: prospects } = await sb
    .from("prospects")
    .select(
      "id,business_name,business_url,status,package_tier,team_size,selected_services,updated_at,primary_product,gap_summary,rating,review_count,city,fit_score",
    )
    .order("updated_at", { ascending: false });
  const all = prospects ?? [];

  // Chip counts reflect the whole book; the board below shows the filtered set.
  const productCounts = PRODUCT_ORDER.reduce(
    (acc, key) => {
      acc[key] = all.filter((r) => r.primary_product === key).length;
      return acc;
    },
    {} as Record<ProductKey, number>,
  );

  const rows = product
    ? all.filter((r) => r.primary_product === product)
    : all;

  const counts = {
    new: rows.filter((r) => r.status === "new").length,
    won: rows.filter((r) => r.status === "won").length,
    all: rows.length,
  };

  const filters: {
    key: ProductKey | "all";
    label: string;
    href: string;
    count: number;
  }[] = [
    { key: "all", label: "All", href: "/sales", count: all.length },
    ...PRODUCT_ORDER.map((key) => ({
      key,
      label: PRODUCT_LABEL[key],
      href: `/sales?product=${key}`,
      count: productCounts[key],
    })),
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Prospects"
        description="Tap a prospect to edit it, then hit Pitch to present. Filter by the product you're leading with."
        actions={
          <LinkButton href="/sales/new" leftIcon={<Plus size={16} />}>
            New prospect
          </LinkButton>
        }
      />

      {/* One toolbar: product filter (left) + a compact pipeline summary (right).
          Per-status counts live in the grouped section headers below, so there's
          no separate stat-card grid duplicating them. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = (f.key === "all" && !product) || f.key === product;
            return (
              <Link
                key={f.key}
                href={f.href}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
                    : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }
              >
                {f.label}
                <span
                  className={
                    active
                      ? "font-mono text-xs text-white/80"
                      : "font-mono text-xs text-[var(--text-subtle)]"
                  }
                >
                  {f.count}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4 px-1 text-xs text-[var(--text-subtle)]">
          <span>
            <span className="font-mono text-sm text-[var(--text)]">{counts.all}</span>{" "}
            total
          </span>
          <span>
            <span className="font-mono text-sm text-[var(--success)]">{counts.won}</span>{" "}
            won
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={
            product ? `No ${PRODUCT_LABEL[product]} prospects` : "No prospects yet"
          }
          description={
            product
              ? "Clear the filter, or tag prospects with this product."
              : "Add your first prospect to start pitching."
          }
        />
      ) : (
        ORDER.map((status) => {
          const items = rows.filter((r) => r.status === status);
          if (items.length === 0) return null;
          return (
            <section key={status}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {LABEL[status]} · {items.length}
              </h2>
              <ul className="space-y-3">
                {items.map((p) => {
                  const low = estimate(
                    p.team_size || "small",
                    p.selected_services ?? [],
                  ).low;
                  const subtitle = p.gap_summary || p.business_url;
                  const meta = [
                    p.city,
                    p.rating
                      ? `${p.rating}★${p.review_count ? ` (${p.review_count})` : ""}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/sales/${p.id}`}
                        className="flex items-start justify-between gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--accent)]"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[var(--text)]">
                              {p.business_name}
                            </p>
                            {p.primary_product ? (
                              <span className="shrink-0 rounded-full border border-[var(--accent)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                                {PRODUCT_LABEL[p.primary_product]}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-sm text-[var(--text-muted)]">
                            {subtitle}
                          </p>
                          {meta ? (
                            <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                              {meta}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-3 pt-0.5">
                          {low > 0 ? (
                            <span className="font-mono text-sm text-[var(--text)]">
                              {usd(low)}+
                            </span>
                          ) : null}
                          {p.fit_score != null ? (
                            <Badge tone={FIT_BAND_TONE[fitBand(p.fit_score)]}>
                              {fitLabel(p.fit_score)}
                            </Badge>
                          ) : null}
                          <Badge tone={TONE[p.status]}>{LABEL[p.status]}</Badge>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}

      <PromoteLeads />
    </div>
  );
}

async function PromoteLeads() {
  const sb = supabaseAdmin();
  const { data: leads } = await sb
    .from("leads")
    .select("id,business_name,business_url")
    .is("converted_client_id", null)
    .order("created_at", { ascending: false })
    .limit(25);
  const { data: existing } = await sb.from("prospects").select("source_lead_id");
  const taken = new Set(
    (existing ?? []).map((e) => e.source_lead_id).filter(Boolean),
  );
  const open = (leads ?? []).filter((l) => !taken.has(l.id));
  if (open.length === 0) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold text-[var(--text)]">
        Promote an audit lead
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {open.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-medium text-[var(--text)]">{l.business_name}</p>
              <p className="truncate text-sm text-[var(--text-muted)]">
                {l.business_url}
              </p>
            </div>
            <form action={promoteLead}>
              <input type="hidden" name="lead_id" value={l.id} />
              <button className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Promote →
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
