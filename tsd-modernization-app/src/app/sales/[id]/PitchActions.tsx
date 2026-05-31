"use client";
import { useState } from "react";
import { setProspectStatus, toggleShare } from "../actions";
import type { ProspectStatus } from "@/lib/supabase/types";

const STATUSES: ProspectStatus[] = ["new", "pitched", "won", "lost"];

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
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
      {STATUSES.map((s) => (
        <form key={s} action={setProspectStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={s} />
          <button
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              status === s
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {s}
          </button>
        </form>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs text-[var(--text)] hover:border-[var(--accent)]"
        >
          {copied ? "Copied!" : "Copy leave-behind link"}
        </button>
        <form action={toggleShare}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="enabled" value={(!shareEnabled).toString()} />
          <button className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
            {shareEnabled ? "Disable link" : "Enable link"}
          </button>
        </form>
      </div>
    </div>
  );
}
