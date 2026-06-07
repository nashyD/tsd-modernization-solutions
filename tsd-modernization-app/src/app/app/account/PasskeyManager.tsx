"use client";
import { useEffect, useState } from "react";
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
import {
  type Passkey,
  listPasskeys,
  enrollPasskey,
  renamePasskey,
  deletePasskey,
  classifyPasskeyError,
  formatPasskeyDate,
} from "@/lib/passkey";
import { useWebAuthnSupported } from "@/lib/useWebAuthnSupported";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";

export default function PasskeyManager() {
  const supported = useWebAuthnSupported();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Initial load, once WebAuthn support resolves. Inlined (not via a shared
  // callback) so every setState lands in an async continuation — effects must
  // not setState synchronously — and so unmount cancels a late response.
  useEffect(() => {
    if (supported !== true) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await listPasskeys();
        if (!cancelled) {
          setPasskeys(list);
          setError(null);
        }
      } catch (err) {
        console.error("[passkey list] failed:", err);
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
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const created = await enrollPasskey();
      setPasskeys((prev) => [...prev, created]);
    } catch (err) {
      console.error("[passkey register] failed:", err);
      const { cancelled, message } = classifyPasskeyError(err, "add");
      if (!cancelled) setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function removePasskey(id: string) {
    if (busy) return;
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
      await deletePasskey(id);
      setPasskeys((prev) => prev.filter((k) => k.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      console.error("[passkey delete] failed:", err);
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
    if (busy) return;
    const name = editName.trim();
    if (!name) {
      setEditingId(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await renamePasskey(id, name);
      setPasskeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, friendly_name: name.slice(0, 120) } : k,
        ),
      );
      setEditingId(null);
    } catch (err) {
      console.error("[passkey rename] failed:", err);
      setError("Couldn't rename that passkey. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (supported === null) {
    return (
      <Card as="section" className="p-5">
        <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </p>
      </Card>
    );
  }

  if (!supported) {
    return (
      <Card as="section" className="p-5">
        <h2 className="flex items-center gap-2 font-semibold text-[var(--text)]">
          <KeyRound size={18} strokeWidth={1.75} className="text-[var(--accent)]" />
          Passkeys
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          This browser doesn&apos;t support passkeys. Try a recent version of
          Safari, Chrome, or Edge on a device with biometrics.
        </p>
      </Card>
    );
  }

  return (
    <Card as="section" className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-[var(--text)]">
            <KeyRound size={18} strokeWidth={1.75} className="text-[var(--accent)]" />
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
        <p
          role="alert"
          className="mt-4 rounded-[10px] border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      )}

      <div className="mt-4">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 size={15} className="animate-spin" /> Loading…
          </p>
        ) : passkeys.length === 0 ? (
          <EmptyState
            icon={<Fingerprint size={24} strokeWidth={1.5} />}
            title="No passkeys yet"
            description="Add one to skip the email link next time."
          />
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
                        aria-label={`Rename ${p.friendly_name || "passkey"}`}
                        value={editName}
                        disabled={busy}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(p.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        maxLength={120}
                        className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 disabled:opacity-50"
                      />
                    ) : (
                      <p className="truncate font-medium text-[var(--text)]">
                        {p.friendly_name || "Passkey"}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                      Added {formatPasskeyDate(p.created_at)}
                      {p.last_used_at
                        ? ` · Last used ${formatPasskeyDate(p.last_used_at)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1">
                  {editingId === p.id ? (
                    <>
                      <IconButton
                        label="Save name"
                        onClick={() => saveEdit(p.id)}
                        disabled={busy}
                      >
                        <Check size={16} strokeWidth={2} />
                      </IconButton>
                      <IconButton
                        label="Cancel"
                        onClick={() => setEditingId(null)}
                        disabled={busy}
                      >
                        <X size={16} strokeWidth={2} />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        label="Rename passkey"
                        onClick={() => startEdit(p)}
                        disabled={busy}
                      >
                        <Pencil size={15} strokeWidth={1.75} />
                      </IconButton>
                      <IconButton
                        label="Remove passkey"
                        onClick={() => removePasskey(p.id)}
                        disabled={busy}
                        danger
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </IconButton>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
