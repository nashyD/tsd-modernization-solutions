"use client";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "connecting" | "live" | "error";

const STATUS_TEXT: Record<Status, string> = {
  idle: "Ready",
  connecting: "Connecting…",
  live: "Live — speak now",
  error: "Error",
};

export default function VoiceWidget({ assistantId }: { assistantId: string }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<Status>("idle");
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
    if (!vapiRef.current) {
      setError("Vapi public key missing — set NEXT_PUBLIC_VAPI_PUBLIC_KEY.");
      setStatus("error");
      return;
    }
    setStatus("connecting");
    try {
      await vapiRef.current.start(assistantId);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not start call");
    }
  }

  function stop() {
    vapiRef.current?.stop();
    setStatus("idle");
  }

  const isLive = status === "live";

  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <Mic size={20} strokeWidth={1.75} />
            {isLive && (
              <span className="absolute right-0 top-0 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--success)]" />
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              {STATUS_TEXT[status]}
            </p>
            <p className="font-mono text-xs text-[var(--text-subtle)]">
              Assistant {assistantId.slice(0, 8)}…
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLive ? (
            <Button
              size="lg"
              onClick={start}
              disabled={status === "connecting"}
              leftIcon={<Phone size={16} strokeWidth={2.25} />}
            >
              {status === "connecting" ? "Connecting…" : "Start test call"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="danger"
              onClick={stop}
              leftIcon={<PhoneOff size={16} strokeWidth={2.25} />}
            >
              End call
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--text-subtle)]">
        Browser will ask for microphone permission the first time. Use a real
        scenario — &ldquo;I need a quote for a 3-ton condenser&rdquo; — and see
        how the agent handles it.
      </p>
    </div>
  );
}
