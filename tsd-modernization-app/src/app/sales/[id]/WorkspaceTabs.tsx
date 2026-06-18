"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * In-page tab strip for the prospect workspace — same app-shell pattern as the
 * portal header (scrollable underline tabs). Splits the long single-scroll
 * record (details / notes / value / files) into one section at a time so the
 * page reads clean. All panels are rendered and toggled with `hidden`, so the
 * server-action forms inside keep any in-progress input when switching tabs.
 */
export type WorkspaceTab = { key: string; label: string; icon: LucideIcon };

export function WorkspaceTabs({
  tabs,
  panels,
}: {
  tabs: WorkspaceTab[];
  panels: Record<string, ReactNode>;
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="border-b border-[var(--border)]">
        <div
          role="tablist"
          aria-label="Prospect sections"
          className="no-scrollbar -mb-px flex gap-1 overflow-x-auto"
        >
          {tabs.map((t) => {
            const on = t.key === active;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(t.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-[var(--accent)] text-[var(--text)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Icon
                  size={15}
                  strokeWidth={2}
                  aria-hidden
                  className={on ? "text-[var(--accent)]" : ""}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        {tabs.map((t) => (
          <div key={t.key} role="tabpanel" hidden={t.key !== active}>
            {panels[t.key]}
          </div>
        ))}
      </div>
    </div>
  );
}
