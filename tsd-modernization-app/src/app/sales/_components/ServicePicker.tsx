"use client";
import { Check } from "lucide-react";
import { SIZES, PRODUCTS, type EstimateResult } from "@/lib/sales/estimator";
import { fmtUsd } from "@/lib/sales/estimator";

export default function ServicePicker({
  sizeId,
  serviceIds,
  estimate,
  onSizeChange,
  onToggleService,
  readOnly = false,
}: {
  sizeId: string;
  serviceIds: string[];
  estimate: EstimateResult;
  onSizeChange: (id: string) => void;
  onToggleService: (id: string) => void;
  readOnly?: boolean;
}) {
  const hasPicks = estimate.serviceIds.length > 0;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Build your modernization
      </h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              01 — How big is your team?
            </p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const active = sizeId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={readOnly}
                    aria-pressed={active}
                    onClick={() => onSizeChange(s.id)}
                    className={`flex-1 min-w-[130px] rounded-[10px] border px-4 py-3 text-left transition-colors disabled:cursor-default ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[var(--text)]">{s.label}</span>
                    <span className="block text-xs text-[var(--text-subtle)]">{s.detail}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              02 — What do you want running?
            </p>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.map((p) => {
                const active = serviceIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={readOnly}
                    aria-pressed={active}
                    onClick={() => onToggleService(p.id)}
                    className={`relative flex-1 min-w-[150px] rounded-[10px] border px-4 py-3 pr-9 text-left transition-colors disabled:cursor-default ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <span
                      className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
                        active ? "bg-[var(--accent)] text-white" : "border border-[var(--border-strong)]"
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="block text-sm font-semibold text-[var(--text)]">{p.label}</span>
                    <span className="block text-xs text-[var(--text-subtle)]">{p.detail}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-[12px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-5">
          {!hasPicks ? (
            <p className="font-display text-lg italic leading-relaxed text-[var(--text-muted)]">
              Pick at least one thing you want running and your estimate appears here.
            </p>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                {estimate.pkg}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                {estimate.isLarger ? "Custom build — typically from" : "Estimated one-time build"}
              </p>
              <p className="mt-1 font-mono text-3xl font-extrabold tracking-tight text-[var(--text)]">
                {estimate.isLarger
                  ? `${fmtUsd(estimate.low)}+`
                  : `${fmtUsd(estimate.low)}–${fmtUsd(estimate.high)}`}
              </p>
              <div className="my-4 h-px bg-[var(--border)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                + Managed AI
              </p>
              <p className="mt-1 text-xl font-bold text-[var(--text)]">
                {estimate.managedMonthly > 0 ? `${fmtUsd(estimate.managedMonthly)}/mo` : "Optional"}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-subtle)]">
                An estimate to frame the conversation — your exact, fixed price
                comes from the call.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
