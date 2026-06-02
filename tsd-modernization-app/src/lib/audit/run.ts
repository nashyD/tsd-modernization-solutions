import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { scrapeWebsite } from "./scrape";
import { lookupPlace } from "./places";
import { synthesizeAudit } from "./synthesize";
import { sendAuditReadyEmail } from "./email";
import { draftEstimatesFromAudit } from "@/lib/sales/draft-estimates";
import type { Json, EstimateServiceKey } from "@/lib/supabase/types";
import type { AuditFormInput, RawAuditData } from "./types";

interface RunAuditOptions {
  auditId: string;
  leadId: string;
  input: AuditFormInput;
  /**
   * When the audit was started from the sales dashboard for a prospect, its id.
   * On completion we auto-draft that prospect's value estimates from the scores
   * and skip the lead "your audit is ready" email (it's an internal run).
   */
  prospectId?: string;
}

export async function runAuditPipeline({
  auditId,
  leadId,
  input,
  prospectId,
}: RunAuditOptions): Promise<void> {
  const sb = supabaseAdmin();
  const t0 = Date.now();
  const elapsed = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;

  try {
    await sb.from("audits").update({ status: "scraping" }).eq("id", auditId);

    const [scrape, places] = await Promise.all([
      scrapeWebsite(input.business_url),
      lookupPlace(input.business_name, input.city ?? ""),
    ]);
    console.log(`[audit ${auditId}] scrape+places ${elapsed()}`);

    const raw: RawAuditData = { scrape, places, input };

    await sb
      .from("audits")
      .update({
        status: "synthesizing",
        raw_data: raw as unknown as Json,
      })
      .eq("id", auditId);

    const tSynthStart = Date.now();
    const { scores, report_md } = await synthesizeAudit({ raw });
    console.log(
      `[audit ${auditId}] synthesize ${((Date.now() - tSynthStart) / 1000).toFixed(1)}s`
    );

    await sb
      .from("audits")
      .update({
        status: "ready",
        scores: scores as unknown as Json,
        report_md,
      })
      .eq("id", auditId);

    // Sales-dashboard run: auto-draft this prospect's value estimates from the
    // fresh audit and link the audit to the prospect. Best-effort — a drafting
    // failure must not flip the audit to failed (the audit itself succeeded).
    if (prospectId) {
      try {
        await sb.from("prospects").update({ audit_id: auditId }).eq("id", prospectId);
        const draft = await draftEstimatesFromAudit({ scores, report_md });
        await sb.from("prospect_estimates").delete().eq("prospect_id", prospectId);
        await sb.from("prospect_estimates").insert(
          draft.estimates.map((e, i) => ({
            prospect_id: prospectId,
            service_key: e.service_key as EstimateServiceKey,
            dollar_value: e.dollar_value,
            rationale: e.rationale,
            sort_order: i,
          })),
        );
        console.log(`[audit ${auditId}] drafted estimates for prospect ${prospectId}`);
      } catch (draftErr) {
        console.error("[audit] estimate draft failed", { auditId, prospectId, error: draftErr });
      }
      return; // internal run — skip the lead-facing "audit ready" email
    }

    try {
      await sendAuditReadyEmail({
        to: input.email,
        businessName: input.business_name,
        auditId,
      });
      console.log(`[audit ${auditId}] total ${elapsed()}`);
    } catch (emailErr) {
      // Don't flip status to failed if email fails — the audit itself is good.
      console.error("[audit] email send failed", { auditId, leadId, error: emailErr });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit error";
    console.error("[audit] pipeline failed", { auditId, leadId, prospectId, error: message });
    await sb
      .from("audits")
      .update({ status: "failed", error_message: message })
      .eq("id", auditId);
  }
}
