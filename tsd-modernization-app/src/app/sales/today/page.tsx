import Link from "next/link";
import { Presentation, Phone, ExternalLink } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import DispositionBar from "../_components/DispositionBar";
import type { ProspectOwner, ProspectStatus } from "@/lib/supabase/types";

function isOwner(v: string | undefined): v is ProspectOwner {
  return v === "grant" || v === "bishop" || v === "nash" || v === "unassigned";
}

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

type QueueSlot = {
  prospect_id: string;
  rank: number;
  kind: "first_touch" | "follow_up";
  reason: string | null;
  brief_md: string | null;
  knock_window: string | null;
};

function dueLabel(nextActionAt: string | null): { text: string; due: boolean } {
  if (!nextActionAt) return { text: "First touch", due: true };
  const when = new Date(nextActionAt).getTime();
  const now = Date.now();
  if (when <= now) return { text: "Due now", due: true };
  const days = Math.ceil((when - now) / 86_400_000);
  return { text: `In ${days}d`, due: false };
}

function todayET(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function TodayBoard({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string }>;
}) {
  const { owner: ownerParam } = await searchParams;
  const ownerFilter = isOwner(ownerParam) ? ownerParam : null;
  const sb = supabaseAdmin();
  const [{ data }, slotsRes] = await Promise.all([
    sb
      .from("prospects")
      .select(
        "id,business_name,status,owner,next_action_at,touch_count,demo_site_url,gap_summary,city,phone,contact_name",
      )
      .not("status", "in", "(won,lost)")
      .order("next_action_at", { ascending: true, nullsFirst: true }),
    // The loop's ranked morning queue. Tolerate absence (pre-migration, or a
    // night the loop didn't run): the page just falls back to cadence order.
    sb
      .from("queue_slots")
      .select("prospect_id,rank,kind,reason,brief_md,knock_window")
      .eq("queue_date", todayET()),
  ]);
  const rows = (data ?? []) as Row[];
  const slots = new Map(
    ((slotsRes.data ?? []) as QueueSlot[]).map((s) => [s.prospect_id, s]),
  );

  const dueCount = rows.filter((r) => dueLabel(r.next_action_at).due).length;
  // Within each owner group: due follow-ups first (cadence order), then the
  // loop's ranked first-touches, then everything else.
  const orderKey = (r: Row): [number, number] => {
    const due = dueLabel(r.next_action_at).due;
    const slot = slots.get(r.id);
    if (due) return [0, r.next_action_at ? new Date(r.next_action_at).getTime() : 0];
    if (slot) return [1, slot.rank];
    return [2, 0];
  };
  const ownerCounts = Object.fromEntries(
    OWNER_ORDER.map((o) => [o, rows.filter((r) => r.owner === o).length]),
  ) as Record<ProspectOwner, number>;
  const byOwner = OWNER_ORDER.filter((o) => !ownerFilter || o === ownerFilter)
    .map((owner) => ({
      owner,
      items: rows
        .filter((r) => r.owner === owner)
        .sort((a, b) => {
          const [ba, ka] = orderKey(a);
          const [bb, kb] = orderKey(b);
          return ba - bb || ka - kb;
        }),
    }))
    .filter((g) => g.items.length > 0);
  const ownerTabs: { key: ProspectOwner | "all"; label: string; count: number }[] = [
    { key: "all", label: "Everyone", count: rows.length },
    { key: "grant", label: "Grant", count: ownerCounts.grant },
    { key: "bishop", label: "Bishop", count: ownerCounts.bishop },
    { key: "nash", label: "Nash", count: ownerCounts.nash },
    { key: "unassigned", label: "Unassigned", count: ownerCounts.unassigned },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Today"
        description="Your live queue, ranked by what is due. Tap one button after each knock or call — that single tap feeds the whole funnel."
      />

      {/* Rep filter — jump straight to your own leads instead of scrolling
          past everyone else's. Counts reflect the whole active book. */}
      <div className="flex flex-wrap gap-2">
        {ownerTabs.map((t) => {
          const active = (t.key === "all" && !ownerFilter) || t.key === ownerFilter;
          const href = t.key === "all" ? "/sales/today" : `/sales/today?owner=${t.key}`;
          return (
            <Link
              key={t.key}
              href={href}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
                  : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }
            >
              {t.label}
              <span
                className={
                  active
                    ? "font-mono text-xs text-white/80"
                    : "font-mono text-xs text-[var(--text-subtle)]"
                }
              >
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

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

      {byOwner.length === 0 ? (
        <EmptyState
          title={ownerFilter ? `Nothing queued for ${ownerTabs.find((t) => t.key === ownerFilter)?.label}` : "Nothing queued"}
          description={
            ownerFilter
              ? "Assign a prospect to this rep from its page (the Owner control), or approve a candidate to route one here."
              : "Promote a lead or add a prospect, then log a disposition to start the cadence."
          }
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
                const slot = slots.get(p.id);
                const leak = slot?.reason || p.gap_summary || p.city || "";
                return (
                  <li
                    key={p.id}
                    className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {slot ? (
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 font-mono text-xs font-bold text-white">
                              {slot.rank}
                            </span>
                          ) : null}
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
                          {slot?.knock_window ? (
                            <Badge tone="neutral">{slot.knock_window}</Badge>
                          ) : null}
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
                        {slot?.brief_md ? (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs font-semibold text-[var(--accent)]">
                              30-second brief
                            </summary>
                            <p className="mt-1 whitespace-pre-wrap rounded-md bg-[var(--surface-2,rgba(0,0,0,0.03))] p-3 text-sm text-[var(--text-muted)]">
                              {slot.brief_md}
                            </p>
                          </details>
                        ) : null}
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
