import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { usd } from "@/lib/sales/services";
import type { ProspectStatus } from "@/lib/supabase/types";
import { promoteLead } from "./actions";

export const dynamic = "force-dynamic";

const ORDER: ProspectStatus[] = ["new", "pitched", "won", "lost"];
const LABEL: Record<ProspectStatus, string> = {
  new: "New",
  pitched: "Pitched",
  won: "Won",
  lost: "Lost",
};
const TONE: Record<ProspectStatus, "amber" | "blue" | "emerald" | "neutral"> = {
  new: "amber",
  pitched: "blue",
  won: "emerald",
  lost: "neutral",
};

export default async function SalesBoard() {
  const sb = supabaseAdmin();
  const { data: prospects } = await sb
    .from("prospects")
    .select(
      "id,business_name,business_url,status,package_tier,deposit_target,updated_at",
    )
    .order("updated_at", { ascending: false });
  const rows = prospects ?? [];
  const counts = {
    new: rows.filter((r) => r.status === "new").length,
    pitched: rows.filter((r) => r.status === "pitched").length,
    won: rows.filter((r) => r.status === "won").length,
    all: rows.length,
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Prospects"
        description="Tap a prospect to open their pitch. Promote audit leads or add one by hand."
        actions={
          <LinkButton href="/sales/new" leftIcon={<Plus size={16} />}>
            New prospect
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["New", counts.new],
            ["Pitched", counts.pitched],
            ["Won", counts.won],
            ["All", counts.all],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              {label}
            </div>
            <div className="font-mono text-2xl text-[var(--text)]">{value}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No prospects yet"
          description="Add your first prospect to start pitching."
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
                {items.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/sales/${p.id}`}
                      className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--text)]">
                          {p.business_name}
                        </p>
                        <p className="truncate text-sm text-[var(--text-muted)]">
                          {p.business_url}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {p.deposit_target > 0 && (
                          <span className="font-mono text-sm text-[var(--text)]">
                            {usd(Number(p.deposit_target))}
                          </span>
                        )}
                        <Badge tone={TONE[p.status]}>{LABEL[p.status]}</Badge>
                      </div>
                    </Link>
                  </li>
                ))}
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
