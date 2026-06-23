import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditScoresSchema } from "@/lib/audit/types";
import type { AuditScores } from "@/lib/audit/types";

/**
 * "Monthly snapshot" — the client's presence score and its month-over-month
 * delta, from the two most recent ready audits. Self-contained server section:
 * fetches its own audits given a clientId so it can sit alongside the deployment
 * card on /app/site.
 */

export async function SnapshotSection({ clientId }: { clientId: string }) {
  const sb = supabaseAdmin();
  const { data: audits } = await sb
    .from("audits")
    .select("id,scores,created_at,status")
    .eq("owner_type", "client")
    .eq("owner_id", clientId)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(2);

  const latest = audits?.[0];
  const previous = audits?.[1];

  const header = (subtitle: string) => (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Monthly snapshot
      </h2>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
        {latest
          ? `Latest audit · ${new Date(latest.created_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
          : "How your presence is trending"}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
    </div>
  );

  if (!latest) {
    return (
      <section className="space-y-5">
        {header(
          "We'll re-run your audit on a monthly cadence and show the diff here. The first one lands within 30 days of your build going live.",
        )}
      </section>
    );
  }

  const latestScores = AuditScoresSchema.safeParse(latest.scores);
  const prevScores = previous ? AuditScoresSchema.safeParse(previous.scores) : null;

  if (!latestScores.success) {
    return (
      <section className="space-y-5">
        {header("How your online presence is trending.")}
        <div className="rounded-[14px] border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-5 text-[var(--warning)]">
          Snapshot data is malformed. The TSD team has been notified.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {header("How your online presence is trending. We re-run the audit every 30 days.")}
      <ScoreSummary
        latest={latestScores.data}
        previous={prevScores?.success ? prevScores.data : null}
      />
    </section>
  );
}

function Delta({ d }: { d: number }) {
  if (d === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--text-subtle)]">
        <Minus size={12} aria-hidden /> 0
      </span>
    );
  if (d > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--success)]">
        <ArrowUp size={12} strokeWidth={2.5} aria-hidden /> {d}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--danger)]">
      <ArrowDown size={12} strokeWidth={2.5} aria-hidden /> {Math.abs(d)}
    </span>
  );
}

function ScoreSummary({
  latest,
  previous,
}: {
  latest: AuditScores;
  previous: AuditScores | null;
}) {
  const delta = previous ? latest.presence_score - previous.presence_score : 0;
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-end gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Presence score
          </p>
          <p className="font-display text-6xl font-semibold tracking-tight text-[var(--text)]">
            {latest.presence_score}
          </p>
        </div>
        {previous && (
          <div className="pb-3">
            <Delta d={delta} />
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[var(--text-subtle)]">
              vs last month
            </p>
          </div>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(latest.pillar_scores).map(([k, v]) => {
          const prev = previous?.pillar_scores[k as keyof typeof previous.pillar_scores];
          const d = prev !== undefined ? v - prev : 0;
          return (
            <div key={k} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                {k}
              </dt>
              <dd className="mt-0.5 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
                  {v}
                </span>
                {previous && d !== 0 && <Delta d={d} />}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
