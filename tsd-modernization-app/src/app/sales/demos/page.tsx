import Link from "next/link";
import { ExternalLink, Presentation, FileText, Link2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProspectStatus } from "@/lib/supabase/types";
import { ParkDemo } from "../_components/ParkDemo";
import { setDemoUrl } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<ProspectStatus, string> = {
  new: "On the shelf",
  pitched: "Pitched",
  won: "Won",
  lost: "Passed",
};
const STATUS_TONE: Record<ProspectStatus, "amber" | "blue" | "emerald" | "neutral"> = {
  new: "amber",
  pitched: "blue",
  won: "emerald",
  lost: "neutral",
};

type DemoRow = {
  id: string;
  business_name: string;
  business_url: string;
  demo_site_url: string;
  status: ProspectStatus;
  city: string | null;
  rating: number | null;
  review_count: number | null;
  gap_summary: string | null;
  notes: string | null;
  converted_client_id: string | null;
  updated_at: string;
};

function host(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function DemoCard({ row }: { row: DemoRow }) {
  const converted = row.converted_client_id != null;
  const meta = [
    row.city,
    row.rating
      ? `${row.rating}★${row.review_count ? ` (${row.review_count})` : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <li className="flex flex-col gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--text)]">{row.business_name}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-[var(--text-muted)]">
            {host(row.demo_site_url)}
          </p>
          {meta ? (
            <p className="mt-0.5 text-xs text-[var(--text-subtle)]">{meta}</p>
          ) : null}
        </div>
        {converted ? (
          <Badge tone="emerald">Client</Badge>
        ) : (
          <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge>
        )}
      </div>
      {row.gap_summary || row.notes ? (
        <p className="line-clamp-2 text-sm text-[var(--text-muted)]">
          {row.gap_summary || row.notes}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <a
          href={row.demo_site_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary-bg)] px-4 text-sm font-semibold text-[var(--primary-fg)] transition-colors hover:bg-[var(--primary-bg-hover)]"
        >
          Open demo <ExternalLink size={14} aria-hidden />
        </a>
        <Link
          href={`/sales/${row.id}/pitch`}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Presentation size={14} aria-hidden /> Pitch
        </Link>
        <Link
          href={`/sales/${row.id}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <FileText size={14} aria-hidden /> Record
        </Link>
      </div>
    </li>
  );
}

function Section({ title, rows }: { title: string; rows: DemoRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {title} · {rows.length}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <DemoCard key={row.id} row={row} />
        ))}
      </ul>
    </section>
  );
}

export default async function DemoShelf() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospects")
    .select(
      "id,business_name,business_url,demo_site_url,status,city,rating,review_count,gap_summary,notes,converted_client_id,updated_at",
    )
    .order("updated_at", { ascending: false });
  const everyone = (data ?? []) as (Omit<DemoRow, "demo_site_url"> & {
    demo_site_url: string | null;
  })[];
  const rows = everyone.filter(
    (r): r is DemoRow => !!r.demo_site_url && r.demo_site_url !== "",
  );
  // Prospects still waiting on a deploy — paste the URL here the moment
  // `vercel --prod` hands it back and they jump onto the shelf.
  const waiting = everyone.filter(
    (r) =>
      (!r.demo_site_url || r.demo_site_url === "") &&
      r.converted_client_id == null &&
      r.status !== "lost",
  );

  const converted = rows.filter((r) => r.converted_client_id != null);
  const active = rows.filter(
    (r) => r.converted_client_id == null && (r.status === "new" || r.status === "pitched"),
  );
  const won = rows.filter(
    (r) => r.converted_client_id == null && r.status === "won",
  );
  const lost = rows.filter(
    (r) => r.converted_client_id == null && r.status === "lost",
  );

  const counts = [
    ["Shelf", active.length],
    ["Won", won.length],
    ["Converted", converted.length],
    ["All demos", rows.length],
  ] as const;

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Sales"
        title="Demo shelf"
        description="Every demo site we've built, parked here until it becomes a real project. Open one on the iPad, pitch it, and mark the prospect won to move it along."
        actions={<ParkDemo />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(([label, value]) => (
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
          title="No demos parked yet"
          description="Park your first demo — a business name and the deployed URL is all it takes."
        />
      ) : (
        <>
          <Section title="On the shelf" rows={active} />
          <Section title="Won — ready to convert" rows={won} />
          <Section title="Converted to clients" rows={converted} />
          <Section title="Passed" rows={lost} />
        </>
      )}

      {waiting.length > 0 ? (
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">
            Waiting on a deploy
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Prospects with no demo yet. Paste the URL when the deploy lands and
            they jump onto the shelf.
          </p>
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {waiting.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/sales/${p.id}`}
                    className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                  >
                    {p.business_name}
                  </Link>
                  {p.city ? (
                    <p className="text-xs text-[var(--text-subtle)]">{p.city}</p>
                  ) : null}
                </div>
                <form action={setDemoUrl} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    name="demo_site_url"
                    required
                    inputMode="url"
                    placeholder="demo-url.vercel.app"
                    aria-label={`Demo URL for ${p.business_name}`}
                    className="w-56 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors focus:border-[var(--accent)]"
                  />
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                    <Link2 size={14} aria-hidden /> Save
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
