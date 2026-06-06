"use client";
import { useEffect, useState } from "react";
import { Fingerprint, X, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";

const DISMISS_KEY = "tsd_passkey_nudge_dismissed";

/**
 * One-time, dismissible prompt on the portal home that nudges signed-in users
 * to enroll a passkey. Self-hides when: the browser lacks WebAuthn, the user
 * already dismissed it, or the user already has at least one passkey.
 */
export default function PasskeyNudge() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.PublicKeyCredential) return;
    if (window.localStorage.getItem(DISMISS_KEY)) return;
    let cancelled = false;
    (async () => {
      try {
        const sb = supabaseBrowser();
        const { data, error } = await sb.auth.passkey.list();
        if (error) return;
        if (!cancelled && (data?.length ?? 0) === 0) setShow(true);
      } catch {
        /* ignore — nudge just stays hidden */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  async function setup() {
    setBusy(true);
    try {
      const sb = supabaseBrowser();
      const { data, error } = await sb.auth.registerPasskey();
      if (error) throw error;
      if (data?.id) {
        try {
          await sb.auth.passkey.update({
            passkeyId: data.id,
            friendlyName: `Passkey · ${new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`,
          });
        } catch {
          /* naming is non-critical */
        }
      }
      try {
        window.localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
      setDone(true);
    } catch {
      // Cancel or failure — leave the nudge up so they can retry or dismiss.
    } finally {
      setBusy(false);
    }
  }

  if (!show) return null;

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-[12px] border border-[var(--success)]/30 bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)] animate-fade-up">
        <Fingerprint size={18} strokeWidth={1.75} className="flex-none" />
        <p>
          Passkey saved. Next time you&apos;ll sign in instantly — no email
          needed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3.5 animate-fade-up sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary-fg)]">
          <Fingerprint size={17} strokeWidth={2} />
        </span>
        <div>
          <p className="font-semibold text-[var(--text)]">
            Skip the email next time
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Set up a passkey to sign in with Face ID, Touch ID, or your device
            PIN.
          </p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          size="sm"
          onClick={setup}
          disabled={busy}
          leftIcon={
            busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Fingerprint size={15} strokeWidth={2} />
            )
          }
        >
          {busy ? "Waiting…" : "Set up passkey"}
        </Button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
