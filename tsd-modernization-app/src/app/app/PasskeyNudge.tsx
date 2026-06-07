"use client";
import { useEffect, useState } from "react";
import { Fingerprint, X, Loader2 } from "lucide-react";
import { listPasskeys, enrollPasskey, classifyPasskeyError } from "@/lib/passkey";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

const DISMISS_KEY = "tsd_passkey_nudge_dismissed";
const PRESENT_KEY = "tsd_passkey_present"; // session cache: "1" has, "0" none

function safeGet(key: string, store: Storage): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string, store: Storage): void {
  try {
    store.setItem(key, value);
  } catch {
    /* ignore — private mode / quota */
  }
}

/**
 * One-time, dismissible prompt on the portal home that nudges signed-in users
 * to enroll a passkey. Self-hides when the browser lacks WebAuthn, the user
 * dismissed it, or they already have a passkey. The list result is cached in
 * sessionStorage so it doesn't re-list on every home visit.
 */
export default function PasskeyNudge() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.PublicKeyCredential) return;
    if (safeGet(DISMISS_KEY, window.localStorage)) return;

    // Enrolled users skip the network check for the rest of the session.
    if (safeGet(PRESENT_KEY, window.sessionStorage) === "1") return;

    let cancelled = false;
    (async () => {
      try {
        const list = await listPasskeys();
        if (cancelled) return;
        if (list.length === 0) {
          setShow(true);
        } else {
          safeSet(PRESENT_KEY, "1", window.sessionStorage);
        }
      } catch (err) {
        // Unknown result — leave the nudge hidden rather than guess.
        console.error("[passkey nudge] list failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-clear the success banner so it doesn't sit on the dashboard forever.
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setShow(false), 5000);
    return () => window.clearTimeout(t);
  }, [done]);

  function dismiss() {
    safeSet(DISMISS_KEY, "1", window.localStorage);
    setShow(false);
  }

  async function setup() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await enrollPasskey();
      safeSet(PRESENT_KEY, "1", window.sessionStorage);
      setDone(true);
    } catch (err) {
      console.error("[passkey setup] failed:", err);
      const { cancelled, message } = classifyPasskeyError(err, "set up");
      if (!cancelled) setError(message);
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
    <div className="rounded-[12px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3.5 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <IconButton label="Dismiss" onClick={dismiss}>
            <X size={16} strokeWidth={2} />
          </IconButton>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
