import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { runAuditPipeline } from "@/lib/audit/run";
import { AuditFormSchema } from "@/lib/audit/types";
import { safeEqual } from "@/lib/safe-compare";

export const runtime = "nodejs";
// Vercel Fluid Compute supports up to 800s on Hobby. Claude tool-use synthesis can
// occasionally push 60s on its own; with scrape + Places + Claude + Resend chained we
// budget 300s to absorb tail latency. Most audits finish in 30-50s.
export const maxDuration = 300;

const RunPayload = z.object({
  auditId: z.string().uuid(),
  leadId: z.string().uuid(),
  input: AuditFormSchema,
  prospectId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const e = env();
  const secret = req.headers.get("x-internal-secret");
  if (!safeEqual(secret, e.INTERNAL_API_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: z.infer<typeof RunPayload>;
  try {
    body = RunPayload.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "invalid payload", detail: String(err) },
      { status: 400 }
    );
  }
  // Ack immediately, then run the long pipeline via after() so the caller's kick
  // is a fast, reliable round-trip instead of holding the connection open for up
  // to maxDuration (where Vercel can drop a fire-and-forget request mid-flight,
  // leaving the audit stuck in 'pending'). The pipeline updates the audit row's
  // status as it progresses, which the audit page polls.
  after(async () => {
    try {
      await runAuditPipeline({
        auditId: body.auditId,
        leadId: body.leadId,
        input: body.input,
        prospectId: body.prospectId,
      });
    } catch (err) {
      console.error("[audit/run] pipeline failed", err);
    }
  });
  return NextResponse.json({ ok: true, queued: true });
}
