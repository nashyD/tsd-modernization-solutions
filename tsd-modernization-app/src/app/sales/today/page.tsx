import Link from "next/link";
import { Presentation, Phone, ExternalLink } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import DispositionBar from "../_components/DispositionBar";
import type { ProspectOwner, ProspectStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

// The rep's one screen. Built from what is actually logged in Supabase — no
// invented numbers. Per-stage conversion ratios live on the vault
// funnel-benchmarks page and stay "no data yet" until dispositions accumulate.

const OWNER_ORDER: ProspectOwner[] = ["grant", "bishop", "nash", "unassigned"];
const OWNER_LABEL: Record<ProspectOwner, string> = {
  grant: "Grant — door-to-door",
  bishop: "Bishop — remote",
  nash: "Nash",
  unassigned: "Unassigned",
};
const STATUS_LABEL: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_shown: "Demo shown",
  fit_call: "Fit call",
  proposal: "Proposal",
  pitched: "Pitched",
  won: "Won",
  lost: "Lost",
};

type Row = {
  id: string;
  business_name: string;
  status: ProspectStatus;
  owner: ProspectOwner;
  next_action_at: string | null;
  touch_count: number;
  demo_site_url: string | null;
  gap_summary: string | null;
  city: string | null;
  phone: string | null;
  contact_name: string | null;
};

function dueLabel(nextActionAt: string | null): { text: string; due: boolean } {
  if (!nextActionAt) return { text: "First touch", due: true };
  const when = new Date(nextActionAt).getTime();
  const now = Date.now();
  if (when <= now) return { text: "Due now", due: true };
  const days = Math.ceil((when - now) / 86_400_000);
  return { text: `In ${days}d`, due: false };
}

export default async function TodayBoard() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospects")
    .select(
      "id,business_name,status,owner,next_action_at,touch_count,demo_site_url,gap_summary,city,phone,contact_name",
    )
    .not("status", "in", "(won,lost)")
    .order("next_action_at", { ascending: true, nullsFirst: true });
  const rows = (data ?? []) as Row[];

  const dueCount = rows.filter((r) => dueLabel(r.next_action_at).due).length;
  const byOwner = OWNER_ORDER.map((owner) => ({
    owner,
    items: rows.filter((r) => r.owner === owner),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Today"
        description="Your live queue, ranked by what is due. Tap one button after each knock or call — that single tap feeds the whole funnel."
      />

      <div className="flex items-center gap-4 px-1 text-xs text-[var(--text-subtle)]">
        <span>
          <span className="font-mono text-sm text-[var(--text)]">{rows.length}</span>{" "}
          active
        </span>
        <span>
          <span className="font-mono text-sm text-[var(--accent)]">{dueCount}</span>{" "}
          due
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing queued"
          description="Promote a lead or add a prospect, then log a disposition to start the cadence."
        />
      ) : (
        byOwner.map((group) => (
          <section key={group.owner}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {OWNER_LABEL[group.owner]} · {group.items.length}
            </h2>
            <ul className="space-y-3">
              {group.items.map((p) => {
                const due = dueLabel(p.next_action_at);
                const leak = p.gap_summary || p.city || "";
                return (
                  <li
                    key={p.id}
                    className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/sales/${p.id}`}
                            className="font-semibold text-[var(--text)] hover:text-[var(--accent)]"
                          >
                            {p.business_name}
                          </Link>
                          <Badge tone="neutral">{STATUS_LABEL[p.status]}</Badge>
                          <Badge tone={p.demo_site_url ? "emerald" : "amber"}>
                            {p.demo_site_url ? "Demo ready" : "No demo"}
                          </Badge>
                          <Badge tone={due.due ? "blue" : "neutral"}>{due.text}</Badge>
                        </div>
                        {leak ? (
                          <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                            {leak}
                          </p>
                        ) : null}
                        <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                          {p.touch_count} touch{p.touch_count === 1 ? "" : "es"}
                          {p.contact_name ? ` · ${p.contact_name}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {p.phone ? (
                          <a
                            href={`tel:${p.phone}`}
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <Phone size={14} /> Call
                          </a>
                        ) : null}
                        {p.demo_site_url ? (
                          <a
                            href={p.demo_site_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <ExternalLink size={14} /> Demo
                          </a>
                        ) : null}
                        <Link
                          href={`/present/${p.id}`}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 text-sm font-semibold text-white"
                        >
                          <Presentation size={14} /> Pitch
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3">
                      <DispositionBar
                        prospectId={p.id}
                        channel={group.owner === "bishop" ? "call" : "in-person"}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
