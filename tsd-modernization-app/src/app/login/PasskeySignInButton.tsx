"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useWebAuthnSupported } from "@/lib/useWebAuthnSupported";
import { classifyPasskeyError } from "@/lib/passkey";
import { Button } from "@/components/ui/Button";

/**
 * Passkey sign-in entry point on /login. Renders nothing on browsers without
 * WebAuthn so the email-link form below remains the path. On success the SSR
 * browser client has already written the session cookie, so we just refresh the
 * server tree and land on /app — no /auth/callback round-trip needed.
 */
export default function PasskeySignInButton() {
  const router = useRouter();
  const supported = useWebAuthnSupported();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supported) return null;

  async function onClick() {
    if (busy) return; // guard against a double-click before `disabled` commits
    setBusy(true);
    setError(null);
    try {
      const { data, error } = await supabaseBrowser().auth.signInWithPasskey();
      if (error) throw error;
      if (!data?.session) throw new Error("no_session");
      router.refresh();
      router.replace("/app");
      // Keep the button busy through navigation to avoid a flash. Safety net: if
      // the navigation doesn't unmount us within a few seconds (e.g. the session
      // cookie wasn't readable server-side yet and /app bounced back to /login),
      // re-enable the button instead of stranding it on "Waiting…".
      window.setTimeout(() => setBusy(false), 8000);
    } catch (err) {
      console.error("[passkey sign-in] failed:", err);
      const { cancelled, message } = classifyPasskeyError(err, "sign in");
      setError(cancelled ? null : message);
      setBusy(false);
    }
  }

  return (
    <>
      <div>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onClick}
          disabled={busy}
          leftIcon={
            busy ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Fingerprint size={18} strokeWidth={2} />
            )
          }
          className="w-full"
        >
          {busy ? "Waiting for passkey…" : "Sign in with a passkey"}
        </Button>
        {error && (
          <p role="alert" className="mt-1.5 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-subtle)]">
          or
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
    </>
  );
}
