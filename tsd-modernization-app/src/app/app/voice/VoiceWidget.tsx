"use client";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export default function VoiceWidget({ assistantId }: { assistantId: string }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "error">(
    "idle"
  );
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

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <p className="text-sm text-zinc-500">Assistant id: {assistantId}</p>
      <div className="mt-4 flex items-center gap-3">
        {status !== "live" ? (
          <button
            type="button"
            onClick={start}
            disabled={status === "connecting"}
            className="rounded-md bg-[#13294B] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {status === "connecting" ? "Connecting…" : "Start test call"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="rounded-md bg-red-600 px-5 py-2.5 font-semibold text-white"
          >
            End call
          </button>
        )}
        <span className="text-sm text-zinc-600">
          {status === "live"
            ? "Live — speak now"
            : status === "connecting"
              ? "Dialing"
              : status === "error"
                ? "Error"
                : "Ready"}
        </span>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
