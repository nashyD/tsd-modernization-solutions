"use client";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Fingerprint,
  KeyRound,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useWebAuthnSupported } from "@/lib/useWebAuthnSupported";
import { Button } from "@/components/ui/Button";

interface Passkey {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function fetchPasskeys(): Promise<Passkey[]> {
  const sb = supabaseBrowser();
  const { data, error } = await sb.auth.passkey.list();
  if (error) throw error;
  return data ?? [];
}

export default function PasskeyManager() {
  const supported = useWebAuthnSupported();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Manual refresh used by the add / rename / remove handlers. These run from
  // event handlers (not effects), so setState here is fine.
  const load = useCallback(async () => {
    try {
      setPasskeys(await fetchPasskeys());
      setError(null);
    } catch {
      setError("Couldn't load your passkeys. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load, once WebAuthn support resolves. Inlined rather than calling
  // `load` so every setState lands in an async continuation (effects must not
  // setState synchronously) and so unmount cancels a late response.
  useEffect(() => {
    if (supported !== true) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchPasskeys();
        if (!cancelled) {
          setPasskeys(list);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Couldn't load your passkeys. Refresh to try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supported]);

  async function addPasskey() {
    setBusy(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { data, error } = await sb.auth.registerPasskey();
      if (error) throw error;
      // registerPasskey() takes no name; give it a friendly default so multiple
      // devices are distinguishable. Best-effort — don't fail the add on this.
      if (data?.id) {
        try {
          await sb.auth.passkey.update({
            passkeyId: data.id,
            friendlyName: `Passkey · ${formatDate(new Date().toISOString())}`,
          });
        } catch {
          /* naming is non-critical */
        }
      }
      await load();
    } catch (err) {
      const e = err as { name?: string; code?: string; message?: string };
      if (e.name === "NotAllowedError" || e.name === "AbortError") {
        // user canceled the OS prompt — stay silent
      } else if (
        e.code === "too_many_passkeys" ||
        /too many/i.test(e.message ?? "")
      ) {
        setError(
          "You've reached the maximum number of passkeys. Remove one before adding another.",
        );
      } else {
        setError("Couldn't add a passkey. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function removePasskey(id: string) {
    if (
      !window.confirm(
        "Remove this passkey? You won't be able to sign in with it anymore.",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.passkey.delete({ passkeyId: id });
      if (error) throw error;
      await load();
    } catch {
      setError("Couldn't remove that passkey. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p: Passkey) {
    setEditingId(p.id);
    setEditName(p.friendly_name ?? "");
  }

  async function saveEdit(id: string) {
    const name = editName.trim();
    if (!name) {
      setEditingId(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.passkey.update({
        passkeyId: id,
        friendlyName: name.slice(0, 120),
      });
      if (error) throw error;
      setEditingId(null);
      await load();
    } catch {
      setError("Couldn't rename that passkey. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (supported === null) {
    return (
      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </p>
      </section>
    );
  }

  if (!supported) {
    return (
      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-2 font-semibold text-[var(--text)]">
          <KeyRound
            size={18}
            strokeWidth={1.75}
            className="text-[var(--accent)]"
          />
          Passkeys
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          This browser doesn&apos;t support passkeys. Try a recent version of
          Safari, Chrome, or Edge on a device with biometrics.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-[var(--text)]">
            <KeyRound
              size={18}
              strokeWidth={1.75}
              className="text-[var(--accent)]"
            />
            Passkeys
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Sign in instantly with Face ID, Touch ID, or your device PIN — no
            email link required.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={addPasskey}
          disabled={busy}
          leftIcon={
            busy ? (
              <Loader2 size={15} strokeWidth={2} className="animate-spin" />
            ) : (
              <Plus size={15} strokeWidth={2.25} />
            )
          }
          className="flex-none"
        >
          Add a passkey
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-[10px] border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="mt-4">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 size={15} className="animate-spin" /> Loading…
          </p>
        ) : passkeys.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] px-4 py-6 text-center">
            <Fingerprint
              size={22}
              strokeWidth={1.5}
              className="mx-auto text-[var(--text-subtle)]"
            />
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              No passkeys yet. Add one to skip the email link next time.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {passkeys.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <ShieldCheck size={17} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    {editingId === p.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(p.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        maxLength={120}
                        className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                      />
                    ) : (
                      <p className="truncate font-medium text-[var(--text)]">
                        {p.friendly_name || "Passkey"}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                      Added {formatDate(p.created_at)}
                      {p.last_used_at
                        ? ` · Last used ${formatDate(p.last_used_at)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1">
                  {editingId === p.id ? (
                    <>
                      <IconBtn
                        label="Save name"
                        onClick={() => saveEdit(p.id)}
                        disabled={busy}
                      >
                        <Check size={16} strokeWidth={2} />
                      </IconBtn>
                      <IconBtn
                        label="Cancel"
                        onClick={() => setEditingId(null)}
                        disabled={busy}
                      >
                        <X size={16} strokeWidth={2} />
                      </IconBtn>
                    </>
                  ) : (
                    <>
                      <IconBtn
                        label="Rename"
                        onClick={() => startEdit(p)}
                        disabled={busy}
                      >
                        <Pencil size={15} strokeWidth={1.75} />
                      </IconBtn>
                      <IconBtn
                        label="Remove"
                        onClick={() => removePasskey(p.id)}
                        disabled={busy}
                        danger
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </IconBtn>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
        danger
          ? "text-[var(--text-subtle)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
