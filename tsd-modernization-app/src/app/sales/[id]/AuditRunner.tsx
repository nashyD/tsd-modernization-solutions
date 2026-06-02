"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { runAudit } from "../actions";
import type { AuditStatus } from "@/lib/supabase/types";

/**
 * Admin-only control on the pitch view: run the presence audit for this
 * prospect and watch it complete. When ready, the pipeline has auto-drafted
 * the value estimates, so we refresh the page to show them.
 */
export default function AuditRunner({
  prospectId,
  auditId,
  initialStatus,
}: {
  prospectId: string;
  auditId: string | null;
  initialStatus: AuditStatus | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuditStatus | null>(initialStatus);
  const running = status === "pending" || status === "scraping" || status === "synthesizing";

  useEffect(() => {
    if (!auditId || !running) return;
    let cancelled = false;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { status: AuditStatus };
        if (cancelled) return;
        setStatus(data.status);
        if (data.status === "ready" || data.status === "failed") {
          clearInterval(t);
          router.refresh(); // estimates were auto-drafted — show them
        }
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [auditId, running, router]);

  return (
    <div className="rounded-[12px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">Value estimates</span> — run the
          audit to auto-draft them from this business&apos;s real presence.
        </div>
        {running ? (
          <span className="inline-flex items-center gap-2 text-sm text-[var(--accent)]">
            <Loader2 size={14} className="animate-spin" /> Auditing… (~1 min)
          </span>
        ) : (
          <form action={runAudit}>
            <input type="hidden" name="prospect_id" value={prospectId} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/15"
            >
              {status === "ready" ? <RefreshCw size={13} /> : <Sparkles size={13} />}
              {status === "ready" ? "Re-run audit" : status === "failed" ? "Retry audit" : "Run audit"}
            </button>
          </form>
        )}
      </div>
      {status === "failed" && (
        <p className="mt-2 text-xs text-[var(--danger)]">
          Audit failed — check the business URL on the Edit page and retry.
        </p>
      )}
    </div>
  );
}
