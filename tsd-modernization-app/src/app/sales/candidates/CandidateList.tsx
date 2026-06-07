"use client";
import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { approveCandidate, rejectCandidate } from "../actions";

export type Candidate = {
  id: string;
  business_name: string;
  city: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  review_count: number | null;
  primary_product:
    | "website"
    | "front_desk"
    | "booking_bridge"
    | "concierge"
    | null;
  gap_summary: string | null;
  fit_score: number | null;
};

const PRODUCT_LABEL: Record<NonNullable<Candidate["primary_product"]>, string> =
  {
    website: "Website",
    front_desk: "AI Receptionist",
    booking_bridge: "Booking",
    concierge: "Concierge",
  };

export function CandidateList({ initial }: { initial: Candidate[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();

  // Optimistically drop the row so the list never re-renders/scroll-jumps under
  // the salesman; the server action (approve→prospect / reject) runs in the
  // background.
  function act(id: string, kind: "approve" | "reject") {
    setItems((cur) => cur.filter((c) => c.id !== id));
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await (kind === "approve" ? approveCandidate(fd) : rejectCandidate(fd));
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        description="No more candidates to review. Run the harvester to surface more."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((c) => {
        const meta = [
          c.city,
          c.rating
            ? `${c.rating}★${c.review_count ? ` (${c.review_count})` : ""}`
            : null,
          c.fit_score != null ? `fit ${c.fit_score}` : null,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <li
            key={c.id}
            className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[var(--text)]">
                    {c.business_name}
                  </p>
                  {c.primary_product ? (
                    <span className="rounded-full border border-[var(--accent)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                      {PRODUCT_LABEL[c.primary_product]}
                    </span>
                  ) : null}
                </div>
                {c.gap_summary ? (
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {c.gap_summary}
                  </p>
                ) : null}
                {meta ? (
                  <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                    {meta}
                  </p>
                ) : null}
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
                  >
                    <ExternalLink size={12} />{" "}
                    {c.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <p className="mt-1 text-xs text-[var(--text-subtle)]">
                    no website
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => act(c.id, "reject")}
                  className="inline-flex min-h-11 items-center rounded-md border border-[var(--border-strong)] px-3 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--text)] hover:text-[var(--text)]"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => act(c.id, "approve")}
                  className="inline-flex min-h-11 items-center rounded-md bg-[var(--accent)] px-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Approve →
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
