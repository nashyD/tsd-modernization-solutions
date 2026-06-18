"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { NotebookPen, X } from "lucide-react";
import { addProspectNote } from "../actions";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/**
 * Composer for a single demo/pitch note. Calls the `addProspectNote` server
 * action, clears itself on success, and reports back via `onSaved`. Used both on
 * the prospect work page and inside the present-mode overlay below.
 */
export function NoteComposer({
  prospectId,
  onSaved,
  rows = 3,
  placeholder = "What happened on this demo? Reactions, objections, next steps…",
  autoFocus = false,
}: {
  prospectId: string;
  onSaved?: () => void;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(fd: FormData) {
    const body = (fd.get("body") ?? "").toString().trim();
    if (!body) return;
    setError(null);
    start(async () => {
      try {
        await addProspectNote(fd);
        formRef.current?.reset();
        onSaved?.();
      } catch {
        setError("Could not save the note. Try again.");
      }
    });
  }

  return (
    <form ref={formRef} action={submit} className="space-y-2">
      <input type="hidden" name="prospect_id" value={prospectId} />
      <Textarea
        name="body"
        rows={rows}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required
        aria-label="Note"
      />
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-sm text-[var(--danger)]">{error}</span>
        ) : (
          <span aria-hidden />
        )}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Add note"}
        </Button>
      </div>
    </form>
  );
}

/**
 * Discreet rep-only control for the present-mode pitch screen. Lives in the TSD
 * chrome (not the client-facing pitch body) and opens a modal clearly marked as
 * internal — for jotting a note right after the demo, once the iPad is back in
 * the rep's hands.
 */
export function PresentModeNote({ prospectId }: { prospectId: string }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Brief "saved" confirmation, then close.
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 900);
    return () => clearTimeout(t);
  }, [saved]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setOpen(true);
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
      >
        <NotebookPen size={14} aria-hidden /> Log note
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Log an internal note"
        >
          <div
            className="w-full max-w-md rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-semibold text-[var(--text)]">
                  Internal note
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                  Saved to this prospect — not shown to the client.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
            <div className="mt-4">
              {saved ? (
                <p className="py-6 text-center text-sm font-medium text-[var(--accent)]">
                  Note saved ✓
                </p>
              ) : (
                <NoteComposer
                  prospectId={prospectId}
                  onSaved={() => setSaved(true)}
                  autoFocus
                  rows={4}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
