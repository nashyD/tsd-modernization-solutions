"use client";
import { useState } from "react";
import { usd } from "@/lib/sales/services";

export default function DepositPanel({
  prospectId,
  token,
  targetDollars,
}: {
  prospectId?: string;
  token?: string;
  targetDollars: number;
}) {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState<number>(targetDollars);
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
          code: code.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg(json.error ?? "Could not start checkout.");
        return;
      }
      if (json.applied_pct > 0) setPreview(json.amount_dollars);
      window.location.href = json.url; // Square hosted checkout
    } catch {
      setMsg("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-[var(--success)]/30 bg-[var(--success-soft)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--success)]">
        Ready to start? Reserve your build
      </h2>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-[var(--text-muted)]">Deposit today</span>
        <span className="font-mono text-3xl font-bold text-[var(--text)]">
          {usd(preview)}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code (optional)"
          className="w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      </div>
      {msg && <p className="mt-2 text-sm text-[var(--danger)]">{msg}</p>}
      <button
        onClick={start}
        disabled={loading}
        className="mt-4 h-12 w-full rounded-md bg-[var(--success)] text-base font-bold text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Starting…" : "Pay deposit with Square →"}
      </button>
    </section>
  );
}
