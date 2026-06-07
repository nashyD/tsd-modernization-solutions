"use client";
import { useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { quickAddProspect } from "../actions";

const INPUT =
  "w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors focus:border-[var(--accent)]";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function submit(formData: FormData) {
    const name = (formData.get("business_name") ?? "").toString().trim();
    if (name.length < 2) return;
    startTransition(async () => {
      await quickAddProspect(formData);
      formRef.current?.reset();
      setAdded(name);
      setTimeout(() => setAdded(null), 3000);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <Plus size={16} /> Quick add a prospect
        {added ? (
          <span className="ml-1 text-xs font-medium text-[var(--success)]">
            Added {added} ✓
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={submit}
      className="space-y-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Quick add
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
      <input
        name="business_name"
        required
        placeholder="Business name *"
        autoCapitalize="words"
        className={INPUT}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="city" placeholder="City (e.g. Gastonia)" className={INPUT} />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          className={INPUT}
        />
      </div>
      <input
        name="business_url"
        placeholder="Website (optional)"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={INPUT}
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-md bg-[var(--accent)] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to pipeline"}
      </button>
      {added ? (
        <p className="text-center text-xs text-[var(--text-subtle)]">
          Added “{added}” — it&apos;ll appear in the queue on next load.
        </p>
      ) : null}
    </form>
  );
}
