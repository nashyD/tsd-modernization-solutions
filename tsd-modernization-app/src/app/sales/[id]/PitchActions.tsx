"use client";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { setProspectStatus, toggleShare } from "../actions";
import type { ProspectStatus } from "@/lib/supabase/types";

const STATUSES: ProspectStatus[] = [
  "new",
  "contacted",
  "demo_shown",
  "fit_call",
  "proposal",
  "won",
  "lost",
];
const LABEL: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_shown: "Demo shown",
  fit_call: "Fit call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export default function PitchActions({
  id,
  status,
  shareEnabled,
  shareUrl,
}: {
  id: string;
  status: ProspectStatus;
  shareEnabled: boolean;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<ProspectStatus | null>(null);
  const current = optimistic ?? status;

  function setStatus(s: ProspectStatus) {
    if (s === current) return;
    setOptimistic(s); // instant feedback; server revalidate confirms it
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", s);
    startTransition(async () => {
      await setProspectStatus(fd);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
      {STATUSES.map((s) => {
        const active = current === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            disabled={pending}
            aria-pressed={active}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60 ${
              active
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border-strong)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
            }`}
          >
            {active && <Check size={14} strokeWidth={3} aria-hidden />}
            {LABEL[s]}
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="inline-flex min-h-11 items-center rounded-md border border-[var(--border-strong)] px-3 text-xs text-[var(--text)] transition-colors hover:border-[var(--accent)]"
        >
          {copied ? "Copied!" : "Copy leave-behind link"}
        </button>
        <form action={toggleShare}>
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="enabled"
            value={(!shareEnabled).toString()}
          />
          <button className="inline-flex min-h-11 items-center rounded-md border border-[var(--border-strong)] px-3 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
            {shareEnabled ? "Disable link" : "Enable link"}
          </button>
        </form>
      </div>
    </div>
  );
}
