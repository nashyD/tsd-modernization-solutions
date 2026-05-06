import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";

let client: Resend | null = null;
function resend() {
  if (client) return client;
  client = new Resend(env().RESEND_API_KEY);
  return client;
}

export async function sendAuditReadyEmail(opts: {
  to: string;
  businessName: string;
  auditId: string;
}) {
  const e = env();
  const url = `${e.NEXT_PUBLIC_SITE_URL}/audit/${opts.auditId}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Your audit is ready</h1>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">
        We've finished the modernization audit for <strong>${escapeHtml(opts.businessName)}</strong>.
        It includes a presence score, the gaps we found, and the specific TSD services that would close them.
      </p>
      <p style="margin: 24px 0;">
        <a href="${url}" style="display: inline-block; background: #13294B; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">View your audit</a>
      </p>
      <p style="font-size: 13px; color: #555; line-height: 1.5; margin: 24px 0 0;">
        Want to talk it through? Reply to this email and one of the founders will set up a 20-minute call.
      </p>
      <p style="font-size: 12px; color: #888; margin: 32px 0 0;">
        TSD Modernization Solutions · Charlotte, NC
      </p>
    </div>
  `;
  const result = await resend().emails.send({
    from: e.RESEND_FROM_EMAIL,
    to: opts.to,
    subject: `Your TSD audit for ${opts.businessName} is ready`,
    html,
  });
  if (result.error) {
    console.error("[email] Resend rejected send", {
      to: opts.to,
      from: e.RESEND_FROM_EMAIL,
      error: result.error,
    });
    throw new Error(
      `Resend send failed: ${result.error.name ?? "error"} — ${result.error.message ?? JSON.stringify(result.error)}`
    );
  }
  console.log("[email] sent", { to: opts.to, id: result.data?.id });
  return result;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
