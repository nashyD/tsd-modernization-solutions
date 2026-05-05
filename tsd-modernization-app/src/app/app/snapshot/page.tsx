import { requireUser, getMemberships } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditScoresSchema } from "@/lib/audit/types";
import type { AuditScores } from "@/lib/audit/types";

export const dynamic = "force-dynamic";

export default async function SnapshotPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships(user.id);
  const ownership = memberships.find((m) => m.role !== "admin");
  if (!ownership) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">Monthly snapshot</h1>
        <p className="mt-2 text-zinc-700">
          You don&apos;t have a TSD client account linked yet.
        </p>
      </div>
    );
  }

  const sb = supabaseAdmin();
  const { data: audits } = await sb
    .from("audits")
    .select("id,scores,created_at,status")
    .eq("owner_type", "client")
    .eq("owner_id", ownership.client_id)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(2);

  const latest = audits?.[0];
  const previous = audits?.[1];

  if (!latest) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-[#13294B]">
          Monthly snapshot
        </h1>
        <p className="mt-2 text-zinc-700">
          We&apos;ll re-run your audit on a monthly cadence and show the diff
          here. The first one will land within 30 days of launch.
        </p>
      </div>
    );
  }

  const latestScores = AuditScoresSchema.safeParse(latest.scores);
  const prevScores = previous
    ? AuditScoresSchema.safeParse(previous.scores)
    : null;

  if (!latestScores.success) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
        Snapshot data is malformed. The TSD team has been notified.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.18em] text-[#4B9CD3]">
          Monthly snapshot
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#13294B]">
          Latest audit · {new Date(latest.created_at).toLocaleDateString()}
        </h1>
      </header>

      <ScoreSummary
        latest={latestScores.data}
        previous={prevScores?.success ? prevScores.data : null}
      />
    </div>
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
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Presence score
          </p>
          <p className="text-5xl font-bold text-[#13294B]">
            {latest.presence_score}
          </p>
        </div>
        {previous && (
          <p
            className={`pb-2 text-sm font-medium ${
              delta > 0
                ? "text-emerald-700"
                : delta < 0
                  ? "text-red-700"
                  : "text-zinc-500"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta} vs last month
          </p>
        )}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(latest.pillar_scores).map(([k, v]) => {
          const prev = previous?.pillar_scores[k as keyof typeof previous.pillar_scores];
          const d = prev !== undefined ? v - prev : 0;
          return (
            <div
              key={k}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2.5"
            >
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                {k}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-[#13294B]">
                {v}
              </dd>
              {previous && (
                <p
                  className={`text-xs ${
                    d > 0
                      ? "text-emerald-700"
                      : d < 0
                        ? "text-red-700"
                        : "text-zinc-400"
                  }`}
                >
                  {d > 0 ? "+" : ""}
                  {d}
                </p>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
}
