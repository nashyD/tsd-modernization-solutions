"use client";
import { useMemo, useState, useTransition } from "react";
import { ExternalLink, Search, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { approveCandidate, rejectCandidate } from "../actions";
import { suggestOwner } from "@/lib/sales/routing";

export type Candidate = {
  id: string;
  business_name: string;
  city: string | null;
  lng: number | null;
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

type OwnerChoice = "grant" | "bishop" | "nash" | "unassigned";
const OWNER_LABEL: Record<OwnerChoice, string> = {
  grant: "Grant",
  bishop: "Bishop",
  nash: "Nash",
  unassigned: "Unassigned",
};

type Product = NonNullable<Candidate["primary_product"]>;

const PRODUCT_LABEL: Record<Product, string> = {
  website: "Website",
  front_desk: "AI Receptionist",
  booking_bridge: "Lead Engine",
  concierge: "Concierge",
};
const PRODUCT_ORDER: Product[] = [
  "website",
  "front_desk",
  "booking_bridge",
  "concierge",
];

export function CandidateList({ initial }: { initial: Candidate[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState<Product | "all">("all");
  // Owner override per card; absent means "use the suggestion".
  const [owners, setOwners] = useState<Record<string, OwnerChoice>>({});

  // Optimistically drop the row so the list never re-renders/scroll-jumps under
  // the salesman; the server action (approve→prospect / reject) runs in the
  // background.
  function act(id: string, kind: "approve" | "reject", owner?: OwnerChoice) {
    setItems((cur) => cur.filter((c) => c.id !== id));
    const fd = new FormData();
    fd.set("id", id);
    if (kind === "approve" && owner) fd.set("owner", owner);
    startTransition(async () => {
      await (kind === "approve" ? approveCandidate(fd) : rejectCandidate(fd));
    });
  }

  const productCounts = useMemo(() => {
    const c: Record<Product, number> = {
      website: 0,
      front_desk: 0,
      booking_bridge: 0,
      concierge: 0,
    };
    for (const it of items) if (it.primary_product) c[it.primary_product] += 1;
    return c;
  }, [items]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        description="No more candidates to review. Run the harvester to surface more."
      />
    );
  }

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (c) =>
      (product === "all" || c.primary_product === product) &&
      (q === "" || c.business_name.toLowerCase().includes(q)),
  );

  const filters: { key: Product | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: items.length },
    ...PRODUCT_ORDER.map((k) => ({
      key: k,
      label: PRODUCT_LABEL[k],
      count: productCounts[k],
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Filter + search — narrow a long harvested list instead of scrolling it. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = product === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setProduct(f.key)}
                aria-pressed={active}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
                    : "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }
              >
                {f.label}
                <span
                  className={
                    active
                      ? "font-mono text-xs text-white/80"
                      : "font-mono text-xs text-[var(--text-subtle)]"
                  }
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:w-64">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            aria-label="Search candidates by name"
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No matches"
          description="No candidates match this filter. Clear it to see the rest."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((c) => {
            const suggested = suggestOwner(c) as OwnerChoice;
            const owner = owners[c.id] ?? suggested;
            const meta = [
              c.fit_score != null ? `fit ${c.fit_score}` : null,
              c.city,
              c.rating
                ? `${c.rating}★${c.review_count ? ` (${c.review_count})` : ""}`
                : null,
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
                        <Badge tone="blue">
                          {PRODUCT_LABEL[c.primary_product]}
                        </Badge>
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
                    <select
                      value={owner}
                      onChange={(e) =>
                        setOwners((cur) => ({
                          ...cur,
                          [c.id]: e.target.value as OwnerChoice,
                        }))
                      }
                      aria-label={`Route ${c.business_name} to`}
                      className="min-h-11 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-2 text-sm text-[var(--text-muted)]"
                    >
                      {(Object.keys(OWNER_LABEL) as OwnerChoice[]).map((o) => (
                        <option key={o} value={o}>
                          {OWNER_LABEL[o]}
                          {o === suggested ? " ✓" : ""}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="min-h-11"
                      onClick={() => act(c.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="min-h-11"
                      rightIcon={<ArrowRight size={14} aria-hidden />}
                      onClick={() => act(c.id, "approve", owner)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
