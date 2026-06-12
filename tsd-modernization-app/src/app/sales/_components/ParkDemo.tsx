"use client";
import { useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { parkDemo } from "../actions";

const INPUT =
  "w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors focus:border-[var(--accent)]";

export function ParkDemo() {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function submit(formData: FormData) {
    const name = (formData.get("business_name") ?? "").toString().trim();
    const demo = (formData.get("demo_site_url") ?? "").toString().trim();
    if (name.length < 2 || demo.length < 4) return;
    startTransition(async () => {
      await parkDemo(formData);
      formRef.current?.reset();
      setAdded(name);
      setOpen(false);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setAdded(null);
          setOpen((v) => !v);
        }}
        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary-bg)] px-4 text-sm font-semibold text-[var(--primary-fg)] transition-colors hover:bg-[var(--primary-bg-hover)]"
      >
        {open ? <X size={16} /> : <Plus size={16} />}
        {open ? "Close" : "Park a demo"}
      </button>

      {added ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]" role="status">
          Parked <span className="font-medium text-[var(--text)]">{added}</span> on
          the shelf.
        </p>
      ) : null}

      {open ? (
        <form
          ref={formRef}
          action={submit}
          className="mt-4 space-y-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Business name
              </span>
              <input
                name="business_name"
                required
                minLength={2}
                placeholder="Kyle Fletcher's BBQ & Catering"
                className={INPUT}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Demo URL
              </span>
              <input
                name="demo_site_url"
                required
                inputMode="url"
                placeholder="kyle-fletchers-bbq.vercel.app"
                className={INPUT}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Their current site{" "}
                <span className="normal-case tracking-normal text-[var(--text-subtle)]">
                  (blank = none, that&apos;s the pitch)
                </span>
              </span>
              <input
                name="business_url"
                inputMode="url"
                placeholder="theiroldsite.com"
                className={INPUT}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                City
              </span>
              <input name="city" placeholder="Gastonia" className={INPUT} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Pitch note
            </span>
            <textarea
              name="notes"
              rows={2}
              placeholder="The hook Grant opens with…"
              className={INPUT}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary-bg)] px-4 text-sm font-semibold text-[var(--primary-fg)] transition-colors hover:bg-[var(--primary-bg-hover)] disabled:opacity-60"
          >
            {pending ? "Parking…" : "Park it"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
