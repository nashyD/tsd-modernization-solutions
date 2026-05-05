import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { scrapeWebsite } from "./scrape";
import { lookupPlace } from "./places";
import { synthesizeAudit } from "./synthesize";
import { sendAuditReadyEmail } from "./email";
import type { Json } from "@/lib/supabase/types";
import type { AuditFormInput, RawAuditData } from "./types";

interface RunAuditOptions {
  auditId: string;
  leadId: string;
  input: AuditFormInput;
}

export async function runAuditPipeline({
  auditId,
  leadId,
  input,
}: RunAuditOptions): Promise<void> {
  const sb = supabaseAdmin();

  try {
    await sb.from("audits").update({ status: "scraping" }).eq("id", auditId);

    const [scrape, places] = await Promise.all([
      scrapeWebsite(input.business_url),
      lookupPlace(input.business_name, input.city ?? ""),
    ]);

    const raw: RawAuditData = { scrape, places, input };

    await sb
      .from("audits")
      .update({
        status: "synthesizing",
        raw_data: raw as unknown as Json,
      })
      .eq("id", auditId);

    const { scores, report_md } = await synthesizeAudit({ raw });

    await sb
      .from("audits")
      .update({
        status: "ready",
        scores: scores as unknown as Json,
        report_md,
      })
      .eq("id", auditId);

    try {
      await sendAuditReadyEmail({
        to: input.email,
        businessName: input.business_name,
        auditId,
      });
    } catch (emailErr) {
      // Don't flip status to failed if email fails — the audit itself is good.
      console.error("[audit] email send failed", { auditId, leadId, error: emailErr });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit error";
    console.error("[audit] pipeline failed", { auditId, leadId, error: message });
    await sb
      .from("audits")
      .update({ status: "failed", error_message: message })
      .eq("id", auditId);
  }
}
