"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Navigation,
  Phone,
  ExternalLink,
  RotateCcw,
  MapPin,
  LocateFixed,
} from "lucide-react";
import { recordVisit } from "../actions";

export type FieldProspect = {
  id: string;
  business_name: string;
  business_url: string;
  phone: string | null;
  city: string | null;
  lat: number;
  lng: number;
  place_id: string | null;
  status: "new" | "pitched" | "won" | "lost";
  primary_product: "website" | "front_desk" | "booking_bridge" | "concierge" | null;
  gap_summary: string | null;
  rating: number | null;
  review_count: number | null;
  notes: string | null;
};

const PRODUCT_LABEL: Record<NonNullable<FieldProspect["primary_product"]>, string> =
  {
    website: "Website",
    front_desk: "AI Receptionist",
    booking_bridge: "Booking",
    concierge: "Concierge",
  };

const STATUSES = ["new", "pitched", "won", "lost"] as const;
const STATUS_LABEL: Record<(typeof STATUSES)[number], string> = {
  new: "New",
  pitched: "Pitched",
  won: "Won",
  lost: "Lost",
};

type LatLng = { lat: number; lng: number };

function haversineMiles(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function mapsHref(p: FieldProspect): string {
  // Prefer the exact Google place id, then our stored coordinates, over a name
  // search — a name can misroute on an ambiguous or duplicated business name.
  if (p.place_id) {
    const dest = `${p.business_name}, ${p.city ?? ""} NC`
      .replace(/\s+/g, " ")
      .trim();
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&destination_place_id=${encodeURIComponent(p.place_id)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
}

export function NextNearby({
  prospects,
  missing,
}: {
  prospects: FieldProspect[];
  missing: number;
}) {
  const [pos, setPos] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [draftStatus, setDraftStatus] =
    useState<(typeof STATUSES)[number]>("new");
  const [draftNotes, setDraftNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [prevId, setPrevId] = useState<string | undefined>(undefined);

  // Only the async geolocation callbacks call setState — safe to run from an effect.
  const applyPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — turn it on to sort by distance."
            : "Couldn't get your location. Working the list unsorted.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  // Manual retry from a button (event handler — setState here is fine).
  const retry = () => {
    setLocating(true);
    setGeoError(null);
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoError("This device can't share a location.");
      setLocating(false);
      return;
    }
    applyPosition();
  };

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      queueMicrotask(() => {
        setGeoError("This device can't share a location.");
        setLocating(false);
      });
      return;
    }
    applyPosition();
  }, []);

  const ranked = useMemo(() => {
    const withDist = prospects.map((p) => ({
      p,
      miles: pos ? haversineMiles(pos, p) : null,
    }));
    if (pos) withDist.sort((a, b) => (a.miles ?? 0) - (b.miles ?? 0));
    return withDist;
  }, [prospects, pos]);

  const queue = ranked.filter((r) => !skipped.has(r.p.id));
  const current = queue[0];
  const upNext = queue.slice(1, 4);
  const currentId = current?.p.id;

  // Reset the visit draft when the current prospect changes (adjust-during-render
  // pattern — no effect, no cascading-render lint error).
  if (current && currentId !== prevId) {
    setPrevId(currentId);
    setDraftStatus(current.p.status);
    setDraftNotes(current.p.notes ?? "");
    setSaved(false);
  }

  const advance = (id: string) =>
    setSkipped((s) => {
      const next = new Set(s);
      next.add(id);
      return next;
    });

  const save = (alsoAdvance: boolean) => {
    if (!current) return;
    const id = current.p.id;
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", draftStatus);
    fd.set("notes", draftNotes);
    startTransition(async () => {
      await recordVisit(fd);
      setSaved(true);
      if (alsoAdvance || draftStatus !== "new") advance(id);
    });
  };

  if (!current) {
    return (
      <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-card)]">
        <p className="font-semibold text-[var(--text)]">
          You&apos;ve worked through the nearby list.
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {prospects.length} prospect{prospects.length === 1 ? "" : "s"} loaded
          {missing > 0 ? ` · ${missing} still need coordinates` : ""}.
        </p>
        <button
          onClick={() => setSkipped(new Set())}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <RotateCcw size={15} /> Start over
        </button>
      </div>
    );
  }

  const c = current.p;
  const miles = current.miles;
  const meta = [c.city, c.rating ? `${c.rating}★${c.review_count ? ` (${c.review_count})` : ""}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-5">
      {/* Location status */}
      {locating ? (
        <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <LocateFixed size={15} className="animate-pulse" /> Getting your
          location…
        </p>
      ) : geoError ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-muted)]">
          <span>{geoError}</span>
          <button
            onClick={retry}
            className="inline-flex shrink-0 items-center gap-1.5 text-[var(--accent)] hover:underline"
          >
            <LocateFixed size={15} /> Use my location
          </button>
        </div>
      ) : null}

      {/* Current prospect */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {c.business_name}
          </h2>
          {c.primary_product ? (
            <span className="rounded-full border border-[var(--accent)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
              Pitch: {PRODUCT_LABEL[c.primary_product]}
            </span>
          ) : null}
        </div>
        {miles != null ? (
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[var(--text)]">
            <MapPin size={14} className="text-[var(--accent)]" /> ~
            {miles.toFixed(1)} mi away
          </p>
        ) : null}
        {meta ? (
          <p className="mt-0.5 text-xs text-[var(--text-subtle)]">{meta}</p>
        ) : null}
        {c.gap_summary ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{c.gap_summary}</p>
        ) : null}

        {/* Primary actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={mapsHref(c)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Navigation size={15} /> Directions
          </a>
          <Link
            href={`/present/${c.id}?from=next`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ExternalLink size={15} /> Open pitch
          </Link>
          {c.phone ? (
            <a
              href={`tel:${c.phone}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Phone size={15} /> Call
            </a>
          ) : null}
        </div>

        {/* Mark the visit */}
        <div className="mt-5 border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraftStatus(s)}
                className={
                  draftStatus === s
                    ? "rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white"
                    : "rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          <textarea
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            placeholder="Notes from the visit…"
            rows={2}
            className="mt-3 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => save(true)}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save & next"}
            </button>
            <button
              type="button"
              onClick={() => advance(c.id)}
              disabled={pending}
              className="rounded-md border border-[var(--border-strong)] px-3.5 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
            >
              Skip
            </button>
            {saved ? (
              <span className="text-sm text-[var(--text-subtle)]">Saved ✓</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Up next */}
      {upNext.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Up next
          </h3>
          <ul className="space-y-2">
            {upNext.map(({ p, miles: m }) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSkipped((s) => {
                      // bring this one to the front by skipping everything before it
                      const next = new Set(s);
                      for (const r of queue) {
                        if (r.p.id === p.id) break;
                        next.add(r.p.id);
                      }
                      return next;
                    })
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition-colors hover:border-[var(--accent)]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">
                      {p.business_name}
                    </p>
                    <p className="truncate text-xs text-[var(--text-subtle)]">
                      {[p.city, p.primary_product ? PRODUCT_LABEL[p.primary_product] : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {m != null ? (
                    <span className="shrink-0 font-mono text-xs text-[var(--text-muted)]">
                      ~{m.toFixed(1)} mi
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {missing > 0 ? (
        <p className="text-xs text-[var(--text-subtle)]">
          {missing} active prospect{missing === 1 ? "" : "s"} hidden — no
          coordinates yet.
        </p>
      ) : null}
    </div>
  );
}
