import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditScoresSchema } from "@/lib/audit/types";
import AuditPolling from "./AuditPolling";
import AuditReport from "./AuditReport";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Audit ${id.slice(0, 8)} · TSD Modernization`,
    description:
      "Your TSD presence audit — website, Google, reviews, trust, and conversion.",
    robots: { index: false, follow: false },
  };
}

export default async function AuditViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const sb = supabaseAdmin();
  const { data: audit } = await sb
    .from("audits")
    .select(
      "id,status,scores,report_md,owner_id,owner_type,created_at"
    )
    .eq("id", id)
    .single();

  if (!audit) notFound();

  let businessName = "your business";
  if (audit.owner_type === "lead") {
    const { data: lead } = await sb
      .from("leads")
      .select("business_name")
      .eq("id", audit.owner_id)
      .single();
    if (lead?.business_name) businessName = lead.business_name;
  } else {
    const { data: client } = await sb
      .from("clients")
      .select("name")
      .eq("id", audit.owner_id)
      .single();
    if (client?.name) businessName = client.name;
  }

  if (audit.status === "ready" && audit.scores && audit.report_md) {
    const parsed = AuditScoresSchema.safeParse(audit.scores);
    if (parsed.success) {
      return (
        <AuditReport
          businessName={businessName}
          scores={parsed.data}
          reportMd={audit.report_md}
        />
      );
    }
  }

  if (audit.status === "failed") {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="mb-10 inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Back to TSD Modernization Solutions"
        >
          <Logo height={22} />
          <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
            TSD Modernization Solutions
          </span>
        </a>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
          Something went sideways
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          We hit an error running your audit. The TSD team has been notified —
          we&apos;ll re-run it and email you when it&apos;s done.
        </p>
      </main>
    );
  }

  return (
    <AuditPolling
      auditId={id}
      businessName={businessName}
      initialStatus={audit.status}
    />
  );
}
