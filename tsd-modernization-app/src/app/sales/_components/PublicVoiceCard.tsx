"use client";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, Mic } from "lucide-react";

const MAX_CALL_SECONDS = 180; // per-call cap on the public link.

export default function PublicVoiceCard({ token }: { token: string }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "live" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) return;
    const vapi = new Vapi(key);
    vapiRef.current = vapi;
    vapi.on("call-start", () => setStatus("live"));
    vapi.on("call-end", () => setStatus("idle"));
    vapi.on("error", (e: unknown) => {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Vapi error");
    });
    return () => {
      vapi.stop();
    };
  }, []);

  async function start() {
    setError(null);
    setStatus("connecting");
    try {
      const res = await fetch(`/api/showcase/${token}/voice-grant`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? "Demo unavailable right now.");
        return;
      }
      await vapiRef.current?.start(json.assistant_id, {
        maxDurationSeconds: MAX_CALL_SECONDS,
      } as Record<string, unknown>);
    } catch {
      setStatus("error");
      setError("Could not start the call.");
    }
  }

  const live = status === "live";
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Your AI receptionist — live demo
      </h2>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <Mic size={20} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Ask your hours, or place an order.
          </p>
        </div>
        {!live ? (
          <button
            onClick={start}
            disabled={status === "connecting"}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 font-semibold text-[var(--primary-fg)] disabled:opacity-60"
          >
            <Phone size={16} />{" "}
            {status === "connecting" ? "Connecting…" : "Start call"}
          </button>
        ) : (
          <button
            onClick={() => vapiRef.current?.stop()}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--danger)] px-5 font-semibold text-white"
          >
            <PhoneOff size={16} /> End
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}
    </section>
  );
}
