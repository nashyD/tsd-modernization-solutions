import { supabaseBrowser } from "@/lib/supabase/browser";

/**
 * Shared client-side passkey helpers. Centralizes the Supabase passkey calls,
 * the cancel/error classification, and date formatting so the sign-in button,
 * the account manager, and the home-screen nudge all go through one tested path
 * instead of three near-copies.
 */

export interface Passkey {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
}

/** Short, locale-aware date label for a passkey row or its default name. */
export function formatPasskeyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * List the signed-in user's passkeys. Throws on an error OR on a null payload,
 * so callers never mistake an unavailable list for "zero passkeys".
 */
export async function listPasskeys(): Promise<Passkey[]> {
  const { data, error } = await supabaseBrowser().auth.passkey.list();
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error("passkey_list_unavailable");
  return data;
}

/**
 * Register a passkey for the signed-in user and give it a friendly default
 * name (so multiple devices are distinguishable). Returns the new row so
 * callers can patch local state without a re-list. Naming is best-effort — a
 * failed rename still returns the (nameless) enrolled passkey.
 */
export async function enrollPasskey(): Promise<Passkey> {
  const sb = supabaseBrowser();
  const { data, error } = await sb.auth.registerPasskey();
  if (error) throw error;
  if (!data?.id) throw new Error("passkey_register_no_id");

  const friendly_name = `Passkey · ${formatPasskeyDate(new Date().toISOString())}`;
  try {
    await sb.auth.passkey.update({ passkeyId: data.id, friendlyName: friendly_name });
  } catch {
    return { id: data.id, created_at: data.created_at };
  }
  return { id: data.id, friendly_name, created_at: data.created_at };
}

export async function renamePasskey(id: string, name: string): Promise<void> {
  const { error } = await supabaseBrowser().auth.passkey.update({
    passkeyId: id,
    friendlyName: name.slice(0, 120),
  });
  if (error) throw error;
}

export async function deletePasskey(id: string): Promise<void> {
  const { error } = await supabaseBrowser().auth.passkey.delete({ passkeyId: id });
  if (error) throw error;
}

export type PasskeyAction = "sign in" | "add" | "set up";

export interface ClassifiedPasskeyError {
  /** User dismissed the OS prompt — treat as a no-op, surface nothing. */
  cancelled: boolean;
  /** User-facing message (null when cancelled). Never leaks SDK internals. */
  message: string | null;
}

function fallbackMessage(action: PasskeyAction): string {
  switch (action) {
    case "sign in":
      return "Couldn't sign in with a passkey. Please try again, or use the email link below.";
    case "add":
      return "Couldn't add a passkey. Please try again.";
    case "set up":
      return "Couldn't set up a passkey. Please try again.";
  }
}

/**
 * Turn a raw passkey/WebAuthn error into a user-safe outcome. The technical
 * detail belongs in console.error for support — never in the UI, since the
 * messages are beta-SDK internals meaningless (and alarming) to clients.
 */
export function classifyPasskeyError(
  err: unknown,
  action: PasskeyAction,
): ClassifiedPasskeyError {
  const e = (err ?? {}) as { name?: string; code?: string; message?: string };
  if (e.name === "NotAllowedError" || e.name === "AbortError") {
    return { cancelled: true, message: null };
  }
  if (e.code === "too_many_passkeys" || /too many/i.test(e.message ?? "")) {
    return {
      cancelled: false,
      message:
        "You've reached the maximum number of passkeys. Remove one before adding another.",
    };
  }
  return { cancelled: false, message: fallbackMessage(action) };
}
