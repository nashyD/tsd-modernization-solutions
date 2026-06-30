"use client";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { logDisposition } from "../actions";
import type { StageDisposition } from "@/lib/supabase/types";

// One tap after a knock or call. Simple dispositions fire immediately; the two
// that need a detail (owner-out captures who/when/email, dead captures a reason)
// expand a small inline form first. This writes the stage event + cadence
// fields server-side — it is the load-bearing input for every funnel ratio.

const SIMPLE: { key: StageDisposition; label: string }[] = [
  { key: "knocked", label: "No answer" },
  { key: "answered", label: "Reached" },
  { key: "demo_shown", label: "Demo shown" },
  { key: "fit_call", label: "Fit call" },
  { key: "proposal_sent", label: "Proposal sent" },
];

export default function DispositionBar({
  prospectId,
  channel = "in-person",
}: {
  prospectId: string;
  channel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<StageDisposition | null>(null);
  const [expanded, setExpanded] = useState<"owner_out" | "dead" | null>(null);

  function fire(
    disposition: StageDisposition,
    extra?: Record<string, string>,
  ) {
    const fd = new FormData();
    fd.set("prospect_id", prospectId);
    fd.set("disposition", disposition);
    fd.set("channel", channel);
    if (extra) for (const [k, v] of Object.entries(extra)) if (v) fd.set(k, v);
    startTransition(async () => {
      await logDisposition(fd);
      setExpanded(null);
      setDone(disposition);
      setTimeout(() => setDone(null), 1800);
    });
  }

  const btn =
    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:opacity-60 border border-[var(--border-strong)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]";

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        {SIMPLE.map((d) => (
          <button
            key={d.key}
            type="button"
            disabled={pending}
            onClick={() => fire(d.key)}
            className={btn}
          >
            {done === d.key && <Check size={14} strokeWidth={3} aria-hidden />}
            {d.label}
          </button>
        ))}
        <button
          type="button"
          disabled={pending}
          onClick={() => setExpanded(expanded === "owner_out" ? null : "owner_out")}
          aria-expanded={expanded === "owner_out"}
          className={btn}
        >
          Owner out
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setExpanded(expanded === "dead" ? null : "dead")}
          aria-expanded={expanded === "dead"}
          className={`${btn} hover:border-[var(--danger)] hover:text-[var(--danger)]`}
        >
          Dead
        </button>
      </div>

      {expanded === "owner_out" && (
        <OwnerOutForm pending={pending} onSubmit={(extra) => fire("owner_out", extra)} />
      )}
      {expanded === "dead" && (
        <DeadForm pending={pending} onSubmit={(reason) => fire("dead", { detail: reason })} />
      )}
    </div>
  );
}

function OwnerOutForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (extra: Record<string, string>) => void;
}) {
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [backInDays, setBackInDays] = useState("2");
  const field =
    "min-h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]";
  return (
    <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-3">
      <input
        className={`${field} flex-1 min-w-[140px]`}
        placeholder="Owner name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        aria-label="Owner name"
      />
      <input
        className={`${field} flex-1 min-w-[160px]`}
        placeholder="Email (only if they offer it)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Owner email"
      />
      <input
        className={`${field} w-28`}
        type="number"
        min={0}
        max={60}
        value={backInDays}
        onChange={(e) => setBackInDays(e.target.value)}
        aria-label="Back in days"
      />
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          onSubmit({ owner_name: ownerName, email, next_action_days: backInDays })
        }
        className="inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        Log owner-out
      </button>
    </div>
  );
}

function DeadForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-3">
      <input
        className="min-h-11 flex-1 min-w-[200px] rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
        placeholder="Reason (not interested, no budget, already covered…)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        aria-label="Dead reason"
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => onSubmit(reason)}
        className="inline-flex min-h-11 items-center rounded-full border border-[var(--danger)] px-4 text-sm font-semibold text-[var(--danger)] disabled:opacity-60"
      >
        Mark dead
      </button>
    </div>
  );
}
