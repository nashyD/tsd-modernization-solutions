"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useWebAuthnSupported } from "@/lib/useWebAuthnSupported";
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
    setBusy(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { data, error } = await sb.auth.signInWithPasskey();
      if (error) throw error;
      if (!data?.session) throw new Error("no_session");
      router.refresh();
      router.replace("/app");
      // Leave the button in its busy state through navigation to avoid a flash.
    } catch (err) {
      const name = (err as { name?: string }).name;
      // User dismissed the OS prompt — not worth a scary message.
      if (name === "NotAllowedError" || name === "AbortError") {
        setError(null);
      } else {
        setError(
          "Couldn't sign in with a passkey. Use the email link below, or add a passkey after signing in.",
        );
      }
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
        {error && <p className="mt-1.5 text-sm text-[var(--danger)]">{error}</p>}
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
