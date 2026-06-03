"use client";
import { useState } from "react";
import { fmtUsd } from "@/lib/sales/estimator";

/**
 * Optional "lock it in early" deposit. The amount is derived from the live
 * service selection (depositPct% of the low estimate), shown for transparency,
 * but the server recomputes authoritatively from the saved selection on
 * checkout — the browser never sends a price.
 */
export default function DepositPanel({
  prospectId,
  token,
  amount,
  hasSelection,
}: {
  prospectId?: string;
  token?: string;
  amount: number;
  hasSelection: boolean;
}) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_id: prospectId,
          token,
          code: code.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg(json.error ?? "Could not start checkout.");
        return;
      }
      window.location.href = json.url;
    } catch {
      setMsg("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Optional — Lock in your spot
      </h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Ready to move now? Put down a deposit to reserve a build slot and we&apos;ll credit it toward
        your project. Totally optional — most people book the call first.
      </p>

      {hasSelection && amount > 0 ? (
        <>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm text-[var(--text-muted)]">Reserve-your-spot deposit</span>
            <span className="font-mono text-2xl font-bold text-[var(--text)]">{fmtUsd(amount)}</span>
          </div>
          {msg && <p className="mt-2 text-sm text-[var(--danger)]">{msg}</p>}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code (optional)"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Promo code"
            className="mt-4 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
          />
          <button
            onClick={start}
            disabled={loading}
            className="mt-3 h-11 w-full rounded-md border border-[var(--success)]/40 bg-[var(--success-soft)] text-sm font-bold text-[var(--success)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Starting…" : `Pay ${fmtUsd(amount)} deposit with Square →`}
          </button>
          <p className="mt-2 text-center text-xs text-[var(--text-subtle)]">
            Credited toward your build · refundable if we&apos;re not the right fit
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-[var(--text-subtle)]">
          Select the services above to see your reserve-your-spot deposit.
        </p>
      )}
    </section>
  );
}
