import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
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
}: {
  estimates: Showcase["estimates"];
}) {
  if (estimates.length === 0) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        What each service is worth to you
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {estimates.map((e) => (
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
    </section>
  );
}

export function OutlineCard({ md }: { md: string | null }) {
  if (!md) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Project outline
      </h2>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
        {md}
      </div>
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
