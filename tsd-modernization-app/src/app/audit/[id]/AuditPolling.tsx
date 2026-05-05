"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (status === "ready" || status === "failed") return;
    let cancelled = false;
    const interval = setInterval(async () => {
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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#4B9CD3]">
        Audit in progress
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#13294B] sm:text-4xl">
        Auditing {businessName}
      </h1>
      <p className="mt-3 text-zinc-700">
        Hang tight — this usually takes 20–40 seconds. You can leave this page;
        we&apos;ll email you when it&apos;s ready.
      </p>

      <div className="mt-10">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-[#4B9CD3] transition-all duration-700"
            style={{ width: `${STATUS_PROGRESS[status]}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-600">{STATUS_LABEL[status]}…</p>
      </div>

      <ol className="mt-12 space-y-3 text-sm text-zinc-700">
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
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      )}
    </main>
  );
}

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-[#4B9CD3] text-white"
            : "border border-zinc-300 bg-white text-zinc-400"
        }`}
        aria-hidden
      >
        {done ? "✓" : "·"}
      </span>
      <span className={done ? "text-zinc-900" : ""}>{children}</span>
    </li>
  );
}
