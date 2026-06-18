import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditScoresSchema } from "@/lib/audit/types";
import { renderAuditPdf } from "@/lib/audit/pdf";

/**
 * GET /api/audit/[id]/pdf
 *
 * Streams a TSD-branded 2-page PDF of a ready audit. Public — same shareable
 * by-UUID semantics as /audit/[id].
 *
 * Powered by puppeteer-core + @sparticuz/chromium (HTML/CSS rendered to PDF
 * by headless Chromium). Allow up to 60s for cold starts; chromium binary
 * unpacks lazily on first invoke.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UUID_RE = /^[0-9a-f-]{36}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const sb = supabaseAdmin();
  const { data: audit, error } = await sb
    .from("audits")
    .select("id, status, scores, owner_id, owner_type, created_at")
    .eq("id", id)
    .single();

  if (error || !audit) {
    return new Response("Not found", { status: 404 });
  }
  if (audit.status !== "ready" || !audit.scores) {
    return new Response("Audit not ready", { status: 409 });
  }

  const parsed = AuditScoresSchema.safeParse(audit.scores);
  if (!parsed.success) {
    return new Response("Invalid audit data", { status: 500 });
  }

  // Resolve display name (mirrors app/audit/[id]/page.tsx).
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

  let buffer: Buffer;
  try {
    buffer = await renderAuditPdf({
      businessName,
      scores: parsed.data,
      generatedAt: new Date(audit.created_at),
    });
  } catch (e) {
    // This route is a public capability URL (UUID-gated, no auth). Log the real
    // chromium/puppeteer detail server-side; return a generic message so internal
    // error text never reaches an anonymous caller.
    console.error("[pdf] render failed", e);
    return new Response(JSON.stringify({ error: "PDF render failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug =
    businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "audit";

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="tsd-audit-${slug}.pdf"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, max-age=300",
    },
  });
}
