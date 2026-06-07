import type { ReactNode } from "react";
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { SERVICE_LABEL, usd, type ServiceKey } from "@/lib/sales/services";
import type { Showcase } from "@/lib/sales/load-showcase";

export function SiteCard({ url }: { url: string | null }) {
  if (!url) return null;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        The website we built you
      </h2>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 text-base font-semibold text-[var(--primary-fg)] hover:bg-[var(--primary-bg-hover)]"
        >
          Open full site <ExternalLink size={16} />
        </a>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="Scan to open the site on your phone"
          width={120}
          height={120}
          className="rounded-lg bg-white p-2"
        />
      </div>
    </section>
  );
}

export function EstimatesCard({
  estimates,
  selectedServiceKeys,
}: {
  estimates: Showcase["estimates"];
  /** When provided, only these services are shown — keeps the value section
   *  in lockstep with the live service picker above it. */
  selectedServiceKeys?: string[];
}) {
  const shown = selectedServiceKeys
    ? estimates.filter((e) => selectedServiceKeys.includes(e.service_key))
    : estimates;
  if (shown.length === 0) return null;
  // Sum the recurring (monthly) value across the shown services for the total.
  const monthlyTotal = shown
    .filter((e) => e.cadence === "monthly")
    .reduce((sum, e) => sum + Number(e.dollar_value || 0), 0);
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        What each service is worth to you
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {shown.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">
                {SERVICE_LABEL[e.service_key as ServiceKey]}
              </p>
              {e.rationale && (
                <p className="text-sm text-[var(--text-muted)]">{e.rationale}</p>
              )}
            </div>
            <span className="shrink-0 font-mono text-lg font-semibold text-[var(--success)]">
              +{usd(Number(e.dollar_value))}
              {e.cadence === "monthly" ? "/mo" : ""}
            </span>
          </li>
        ))}
      </ul>
      {monthlyTotal > 0 && (
        <div className="mt-3 flex items-center justify-between gap-4 border-t-2 border-[var(--border-strong)] pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text)]">
            Total estimated value added
          </p>
          <span className="shrink-0 font-mono text-2xl font-bold text-[var(--success)]">
            +{usd(monthlyTotal)}/mo
          </span>
        </div>
      )}
    </section>
  );
}

/** Minimal inline markdown: **bold** only (outlines are mostly headings/bullets). */
function mdInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function OutlineCard({ md }: { md: string | null }) {
  if (!md) return null;
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: string) => {
    if (bullets.length) {
      const items = bullets;
      bullets = [];
      blocks.push(
        <ul
          key={key}
          className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-[var(--text)]"
        >
          {items.map((b, i) => (
            <li key={i}>{mdInline(b)}</li>
          ))}
        </ul>,
      );
    }
  };
  md.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (/^#{1,3}\s/.test(line)) {
      flush(`f${i}`);
      blocks.push(
        <p key={i} className="font-semibold text-[var(--text)]">
          {mdInline(line.replace(/^#{1,3}\s+/, ""))}
        </p>,
      );
    } else if (/^[-*]\s/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, ""));
    } else if (line === "") {
      flush(`f${i}`);
    } else {
      flush(`f${i}`);
      blocks.push(
        <p key={i} className="text-sm leading-relaxed text-[var(--text)]">
          {mdInline(line)}
        </p>,
      );
    }
  });
  flush("fend");
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Project outline
      </h2>
      <div className="mt-3 space-y-2">{blocks}</div>
    </section>
  );
}

export function AssetsCard({ assets }: { assets: Showcase["assets"] }) {
  if (assets.length === 0) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Demo work
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {assets.map((a) =>
          a.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={a.id}
              src={a.url}
              alt={a.label ?? "Demo asset"}
              className="rounded-lg border border-[var(--border)]"
            />
          ) : (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)] hover:border-[var(--accent)]"
            >
              {a.kind === "pdf" ? <FileText size={16} /> : <ImageIcon size={16} />}
              {a.label ?? "Open file"}
            </a>
          ),
        )}
      </div>
    </section>
  );
}

/**
 * Static proof / case-study card shown on every pitch — a real TSD build that's
 * live now. Anchors credibility for cold prospects who have no demo of their own
 * yet. (Bisque is a Belmont, NC wholesaler — same county as most prospects.)
 */
export function ProofCard() {
  const url = "https://bisque-imports.vercel.app";
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Proof — a build we shipped, live now
      </h2>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--text)]">
            Bisque Imports — Belmont, NC
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            An established local wholesale supplier. We built and shipped a live
            AI assistant that instantly answers customer questions across their
            full 8,700-product catalog and video library — grounded in their own
            content, linking straight to the right product.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 text-sm font-semibold text-[var(--primary-fg)] hover:bg-[var(--primary-bg-hover)]"
          >
            See it live <ExternalLink size={16} />
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="Scan to open the live Bisque Imports assistant"
          width={120}
          height={120}
          className="shrink-0 self-center rounded-lg bg-white p-2"
        />
      </div>
    </section>
  );
}

/**
 * Risk-reversal card shown right before the close on the pitch + leave-behind.
 * Surfaces TSD's guarantees (from the $5k Website + AI offer) at the decision
 * point — the highest-leverage persuasion element, previously absent here.
 */
export function GuaranteeCard() {
  const items = [
    "Live in 14 days from signing — or 25% back.",
    "Your first 3 AI-captured leads within 30 days — or we refund the AI and rebuild it free.",
    "You own the source code from day one.",
    "Managed AI is optional and cancel-anytime — no lock-in.",
  ];
  return (
    <section className="rounded-[14px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        Our guarantee — the risk is on us
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-[var(--accent)]"
              aria-hidden
            />
            <span className="text-sm font-medium text-[var(--text)]">{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
