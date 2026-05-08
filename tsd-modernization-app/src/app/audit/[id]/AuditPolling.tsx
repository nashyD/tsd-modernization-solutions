"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import type { AuditStatus } from "@/lib/supabase/types";

const STATUS_LABEL: Record<AuditStatus, string> = {
  pending: "Queued",
  scraping: "Scanning your website and Google profile",
  synthesizing: "Writing your audit",
  ready: "Ready",
  failed: "Failed",
};

const STATUS_PROGRESS: Record<AuditStatus, number> = {
  pending: 10,
  scraping: 35,
  synthesizing: 75,
  ready: 100,
  failed: 100,
};

const STALE_THRESHOLD_MS = 90_000;

export default function AuditPolling({
  auditId,
  businessName,
  initialStatus,
}: {
  auditId: string;
  businessName: string;
  initialStatus: AuditStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuditStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState<number>(() => Date.now());
  const [now, setNow] = useState<number>(() => Date.now());
  const elapsedMs = now - startedAt;
  const isStale = elapsedMs > STALE_THRESHOLD_MS && status !== "ready" && status !== "failed";

  useEffect(() => {
    if (status === "ready" || status === "failed") return;
    let cancelled = false;
    const interval = setInterval(async () => {
      setNow(Date.now());
      try {
        const res = await fetch(`/api/audit/${auditId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          status: AuditStatus;
          error_message: string | null;
        };
        if (cancelled) return;
        setStatus(data.status);
        if (data.error_message) setError(data.error_message);
        if (data.status === "ready" || data.status === "failed") {
          clearInterval(interval);
          router.refresh();
        }
      } catch {
        // network blip — keep polling
      }
    }, 2500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [auditId, status, router]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12 sm:py-16 animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4B9CD3]">
        Audit in progress
      </p>
      <h1 className="mt-2 text-balance font-display text-[34px] font-semibold leading-[1.05] tracking-tight text-[#13294B] sm:text-[40px]">
        Auditing {businessName}
      </h1>
      <p className="mt-3 text-zinc-600">
        Hang tight — this usually takes 20–40 seconds. You can leave this page;
        we&apos;ll email you when it&apos;s ready.
      </p>

      <div className="mt-10">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4B9CD3] to-[#13294B] transition-all duration-700 ease-out"
            style={{ width: `${STATUS_PROGRESS[status]}%` }}
          />
        </div>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-600">
          {status !== "ready" && status !== "failed" && (
            <Loader2
              size={14}
              className="animate-spin text-[#4B9CD3]"
              aria-hidden
            />
          )}
          {STATUS_LABEL[status]}…
        </p>
      </div>

      <ol className="mt-10 space-y-2.5 text-sm text-zinc-700">
        <Step done={["scraping", "synthesizing", "ready"].includes(status)}>
          Fetching your website and locating your Google Business Profile
        </Step>
        <Step done={["synthesizing", "ready"].includes(status)}>
          Scoring presence, gaps, and TSD service fit
        </Step>
        <Step done={status === "ready"}>
          Writing your client-ready audit report
        </Step>
      </ol>

      {error && (
        <p className="mt-8 rounded-[10px] border border-red-200 bg-red-50/70 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      )}

      {isStale && (
        <div className="mt-8 rounded-[10px] border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">This is taking longer than usual.</p>
          <p className="mt-1">
            The audit is still running on our side. You can close this tab
            safely — we&apos;ll email you when it&apos;s ready. If you don&apos;t
            see anything within 10 minutes, reply to{" "}
            <a className="underline" href="mailto:hello@tsd-modernization.com">
              hello@tsd-modernization.com
            </a>{" "}
            and we&apos;ll re-run it manually.
          </p>
        </div>
      )}
    </main>
  );
}

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full transition-colors ${
          done
            ? "bg-[#4B9CD3] text-white"
            : "border border-zinc-200 bg-white text-zinc-300"
        }`}
        aria-hidden
      >
        {done ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className={done ? "text-zinc-900" : "text-zinc-500"}>
        {children}
      </span>
    </li>
  );
}
