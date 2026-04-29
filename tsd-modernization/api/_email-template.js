/* ── TSD-branded chat-transcript email template ────────────────────
 *
 * Mirror of the voice-receptionist's tools.py email pipeline, ported
 * to JS so the chat agent + voice agent send visually identical emails.
 * Brand palette (`BRAND` dict) and gradient match src/shared.jsx +
 * voice-receptionist's _BRAND, so future palette tweaks need to land
 * in three places: this file, src/shared.jsx, voice-receptionist/tools.py.
 *
 * Path resolution: the TSD logo PNG lives at
 *   content/email-assets/tsd-ms-logo.png
 * and is loaded relative to THIS file's directory via import.meta.url
 * rather than process.cwd(). Vercel runs functions from /var/task/
 * but this project's actual app code is nested at
 * /var/task/tsd-modernization/, so a cwd-relative path 404s. Same
 * trap that bricked /api/agent before we fixed it the same way.
 *
 * Underscore prefix on the filename keeps Vercel from exposing this
 * helper as an HTTP endpoint — only api/*.js files without an
 * underscore become routes.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Mirror of _BRAND in voice-receptionist/tools.py + src/shared.jsx tokens.
export const BRAND = {
  navy: "#13294B",
  navy_light: "#1d3a66",
  carolina: "#4B9CD3",
  carolina_light: "#7BB8E0",
  carolina_dark: "#3a7db0",
  steel: "#2c5f8a",
  cream: "#e8e0d4",
  gold: "#c9b896",
  success: "#06d6a0",
  error: "#ef4444",
  // Derived neutrals used only by the email template.
  ink: "#111827",
  muted: "#5b6573",
  subtle: "#94a3b8",
  rule: "#e2e8f0",
  page_bg: "#eef2f7",
  card_bg: "#ffffff",
  footer_bg: "#f7f9fc",
  // Speaker bubbles — Carolina tint vs cream tint to distinguish AI/Visitor.
  ai_bg: "#eaf2fb",
  ai_label: "#13294B",
  caller_bg: "#f6f1e6",
  caller_label: "#2c5f8a",
  // Tool-call rows.
  tool_bg: "#f7f9fc",
  tool_text: "#5b6573",
  ok_bg: "#e6faf3",
  ok_text: "#0a9871",
  ok_border: "#06d6a0",
  fail_bg: "#fdecec",
  fail_text: "#b91c1c",
  fail_border: "#ef4444",
};

export const BRAND_GRADIENT =
  `linear-gradient(135deg,${BRAND.carolina_light} 0%,` +
  `${BRAND.carolina} 35%,${BRAND.steel} 70%,${BRAND.navy} 100%)`;

// Logo loaded once at module init. Path is relative to this file
// (api/_email-template.js → ../content/email-assets/tsd-ms-logo.png).
const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = join(
  __dirname,
  "..",
  "content",
  "email-assets",
  "tsd-ms-logo.png",
);
let LOGO_BYTES = null;
let LOGO_CID = null;
try {
  LOGO_BYTES = readFileSync(LOGO_PATH);
  LOGO_CID = "tsd-ms-logo";
} catch {
  console.warn(
    `[email-template] TSD logo not found at ${LOGO_PATH}; emails will be logo-less`,
  );
}

export function getLogo() {
  return { bytes: LOGO_BYTES, cid: LOGO_CID };
}

// ── String helpers ────────────────────────────────────────────────

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function looksLikeEmail(value) {
  if (!value) return false;
  const v = String(value);
  return v.includes("@") && v.split("@").pop().includes(".");
}

function formatWhen(input) {
  // Accepts ISO string, ms epoch, or "YYYY-MM-DD HH:MM:SS UTC" (the
  // voice-receptionist format). Renders in America/New_York for Nash.
  if (input == null || input === "") return "(unknown)";
  let d = new Date(input);
  if (isNaN(d.getTime()) && typeof input === "string") {
    const m = input.match(
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) UTC$/,
    );
    if (m) {
      d = new Date(
        Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]),
      );
    }
  }
  if (isNaN(d.getTime())) return String(input);
  try {
    return d.toLocaleString("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return d.toISOString();
  }
}

// ── Summary rendering ─────────────────────────────────────────────

function row(label, value, valueIsHtml = false) {
  const val = valueIsHtml ? value : escapeHtml(value);
  return (
    `<tr>` +
    `<td style="padding:8px 0;font-size:13px;color:${BRAND.muted};` +
    `width:140px;vertical-align:top;">${escapeHtml(label)}</td>` +
    `<td style="padding:8px 0;font-size:14px;color:${BRAND.ink};` +
    `line-height:1.55;">${val}</td>` +
    `</tr>`
  );
}

function formatChatSummaryHtml({
  visitorName,
  visitorEmail,
  businessName,
  summary,
  pageUrl,
  startedAt,
  leadCaptured,
}) {
  const rows = [];
  if (visitorName) rows.push(row("Visitor", visitorName));
  if (visitorEmail && looksLikeEmail(visitorEmail)) {
    const link =
      `<a href="mailto:${escapeHtml(visitorEmail)}" ` +
      `style="color:${BRAND.carolina};text-decoration:none;font-weight:600;">` +
      `${escapeHtml(visitorEmail)}</a>`;
    rows.push(row("Email", link, true));
  }
  if (businessName && businessName !== "Not provided") {
    rows.push(row("Business", businessName));
  }
  if (summary) rows.push(row("What they want", summary));
  if (pageUrl) {
    const safeUrl = escapeHtml(pageUrl);
    const linked =
      `<a href="${safeUrl}" ` +
      `style="color:${BRAND.carolina};text-decoration:none;">` +
      `${safeUrl}</a>`;
    rows.push(row("Page", linked, true));
  }
  rows.push(row("Started", formatWhen(startedAt)));

  // Outcome chip — green if a lead was captured, neutral if just a chat.
  const isClean = Boolean(leadCaptured);
  const label = leadCaptured
    ? "Lead captured"
    : "Conversation ended without lead";
  const color = isClean ? BRAND.ok_text : BRAND.muted;
  const bg = isClean ? BRAND.ok_bg : BRAND.footer_bg;
  const chip =
    `<span style="display:inline-block;padding:2px 10px;` +
    `background-color:${bg};color:${color};border-radius:999px;` +
    `font-size:12px;font-weight:600;">${escapeHtml(label)}</span>`;
  rows.push(row("Outcome", chip, true));

  return (
    `<table role="presentation" width="100%" cellpadding="0" ` +
    `cellspacing="0" border="0">${rows.join("")}</table>`
  );
}

// ── Transcript rendering ──────────────────────────────────────────
//
// Anthropic message format: each message has role + content. Content
// is either a plain string OR an array of blocks ({type:"text"|"tool_use"|"tool_result"}).
// We yield renderable items (text bubbles or tool rows), filtering empty
// content and the synthetic kickoff messages.

function* iterTranscriptItems(messages) {
  for (const msg of messages || []) {
    if (typeof msg !== "object" || !msg) continue;
    const role = msg.role || "";
    const content = msg.content;
    if (typeof content === "string") {
      const text = content.trim();
      if (!text) continue;
      yield { kind: "text", role, payload: text };
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        if (block.type === "text") {
          const text = (block.text || "").trim();
          if (text) yield { kind: "text", role, payload: text };
        } else if (block.type === "tool_use") {
          yield {
            kind: "tool_use",
            role,
            payload: { name: block.name || "", input: block.input || {} },
          };
        } else if (block.type === "tool_result") {
          let res = block.content || "";
          if (Array.isArray(res)) {
            res = res
              .map((b) =>
                typeof b === "object" && b ? b.text || "" : String(b),
              )
              .join(" ");
          }
          yield { kind: "tool_result", role, payload: String(res) };
        }
      }
    }
  }
}

function formatTranscriptHtml(messages) {
  const blocks = [];
  for (const item of iterTranscriptItems(messages)) {
    const { kind, role, payload } = item;
    if (kind === "text") {
      const isAi = role === "assistant";
      const label = isAi ? "AI" : "Visitor";
      const labelColor = isAi ? BRAND.ai_label : BRAND.caller_label;
      const bg = isAi ? BRAND.ai_bg : BRAND.caller_bg;
      blocks.push(
        `<div style="margin-bottom:14px;">` +
          `<div style="font-size:10px;font-weight:700;` +
          `text-transform:uppercase;letter-spacing:1.4px;` +
          `color:${labelColor};margin-bottom:5px;">${label}</div>` +
          `<div style="padding:11px 15px;background-color:${bg};` +
          `border-radius:10px;color:${BRAND.ink};font-size:14px;` +
          `line-height:1.55;white-space:pre-wrap;">${escapeHtml(payload)}</div>` +
          `</div>`,
      );
    } else if (kind === "tool_use") {
      let inputJson;
      try {
        inputJson = JSON.stringify(payload.input);
      } catch {
        inputJson = String(payload.input);
      }
      blocks.push(
        `<div style="margin:4px 0 8px;padding:7px 12px;` +
          `background-color:${BRAND.tool_bg};border-left:3px solid ` +
          `${BRAND.carolina_light};font-family:ui-monospace,` +
          `SFMono-Regular,Menlo,monospace;font-size:11px;` +
          `color:${BRAND.tool_text};line-height:1.5;` +
          `word-break:break-word;border-radius:0 6px 6px 0;">` +
          `→ ${escapeHtml(payload.name)}(${escapeHtml(inputJson)})` +
          `</div>`,
      );
    } else if (kind === "tool_result") {
      const ok =
        payload.includes('"ok":true') ||
        payload.includes('"ok": true') ||
        /Lead submitted/i.test(payload);
      const fail =
        payload.includes('"ok":false') ||
        payload.includes('"ok": false') ||
        /failed/i.test(payload);
      const isOk = ok && !fail;
      const bg = isOk ? BRAND.ok_bg : fail ? BRAND.fail_bg : BRAND.tool_bg;
      const text = isOk
        ? BRAND.ok_text
        : fail
          ? BRAND.fail_text
          : BRAND.tool_text;
      const border = isOk
        ? BRAND.ok_border
        : fail
          ? BRAND.fail_border
          : BRAND.carolina_light;
      blocks.push(
        `<div style="margin:0 0 14px;padding:7px 12px;` +
          `background-color:${bg};border-left:3px solid ${border};` +
          `font-family:ui-monospace,SFMono-Regular,Menlo,monospace;` +
          `font-size:11px;color:${text};line-height:1.5;` +
          `word-break:break-word;border-radius:0 6px 6px 0;">` +
          `← ${escapeHtml(payload)}` +
          `</div>`,
      );
    }
  }
  if (!blocks.length) {
    return (
      `<p style="color:${BRAND.muted};font-style:italic;">` +
      `(no exchange recorded)</p>`
    );
  }
  return blocks.join("");
}

// ── Plain-text fallback ────────────────────────────────────────────

function formatPlainTextSummary({
  visitorName,
  visitorEmail,
  businessName,
  summary,
  pageUrl,
  startedAt,
  leadCaptured,
  conversationId,
}) {
  const lines = ["=".repeat(60), "CHAT SUMMARY", "=".repeat(60)];
  lines.push(`Visitor: ${visitorName || "anonymous"}`);
  if (visitorEmail) lines.push(`Email: ${visitorEmail}`);
  if (businessName && businessName !== "Not provided") {
    lines.push(`Business: ${businessName}`);
  }
  if (summary) {
    lines.push("");
    lines.push("What they want:");
    lines.push(summary);
  }
  if (pageUrl) lines.push(`Page: ${pageUrl}`);
  lines.push(`Started: ${formatWhen(startedAt)}`);
  lines.push(
    `Outcome: ${leadCaptured ? "Lead captured" : "Conversation ended without lead"}`,
  );
  lines.push("");
  lines.push(`Conversation ID: ${conversationId || "unknown"}`);
  return lines.join("\n");
}

function formatPlainTextTranscript(messages) {
  const lines = [
    "=".repeat(60),
    "FULL TRANSCRIPT",
    "=".repeat(60),
    "",
  ];
  let any = false;
  for (const item of iterTranscriptItems(messages)) {
    any = true;
    if (item.kind === "text") {
      const label = item.role === "assistant" ? "AI" : "VISITOR";
      lines.push(`[${label}] ${item.payload}`);
    } else if (item.kind === "tool_use") {
      let inp;
      try {
        inp = JSON.stringify(item.payload.input);
      } catch {
        inp = String(item.payload.input);
      }
      lines.push(`  → ${item.payload.name}(${inp})`);
    } else if (item.kind === "tool_result") {
      lines.push(`  ← ${item.payload}`);
    }
  }
  if (!any) return "(no exchange recorded)";
  return lines.join("\n");
}

// ── Public entry point ─────────────────────────────────────────────

export function buildChatTranscriptEmail({
  conversationId,
  messages,
  capturedLead,
  pageUrl,
  startedAt,
}) {
  const visitorName = capturedLead?.name || "";
  const visitorEmail = capturedLead?.email || "";
  const businessName = capturedLead?.business || "";
  const summary = capturedLead?.summary || "";
  const leadCaptured = Boolean(capturedLead);

  const headerName = visitorName || "anonymous visitor";

  const summaryHtml = formatChatSummaryHtml({
    visitorName,
    visitorEmail,
    businessName,
    summary,
    pageUrl,
    startedAt,
    leadCaptured,
  });
  const transcriptHtml = formatTranscriptHtml(messages);

  const { bytes: logoBytes, cid: logoCid } = getLogo();
  const brandBlock = logoCid
    ? `<img src="cid:${logoCid}" alt="TSD Modernization Solutions" ` +
      `width="240" style="display:block;width:240px;max-width:80%;` +
      `height:auto;margin:0 auto;">`
    : `<div style="font-size:32px;font-weight:800;letter-spacing:8px;` +
      `color:#ffffff;text-align:center;">T S D</div>` +
      `<div style="font-size:11px;font-weight:500;letter-spacing:6px;` +
      `color:${BRAND.carolina_light};text-align:center;margin-top:6px;">` +
      `MODERNIZATION SOLUTIONS</div>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chat agent conversation</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background-color:${BRAND.page_bg};color:${BRAND.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.page_bg};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background-color:${BRAND.card_bg};border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(19,41,75,0.10),0 1px 2px rgba(19,41,75,0.05);">
      <tr><td style="padding:32px 26px 24px;background:${BRAND.navy};background:${BRAND_GRADIENT};color:#ffffff;text-align:center;">
        ${brandBlock}
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2.5px;color:#ffffff;opacity:0.85;margin-top:18px;">Chat Agent</div>
        <div style="font-size:22px;font-weight:700;margin-top:6px;color:#ffffff;line-height:1.3;">New chat from ${escapeHtml(headerName)}</div>
      </td></tr>
      <tr><td style="padding:26px 28px 6px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;color:${BRAND.carolina_dark};margin:0 0 14px;">Chat summary</div>
        ${summaryHtml}
      </td></tr>
      <tr><td style="padding:0 28px 26px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;color:${BRAND.carolina_dark};margin:0 0 14px;padding-top:22px;border-top:1px solid ${BRAND.rule};">Transcript</div>
        ${transcriptHtml}
      </td></tr>
      <tr><td style="padding:16px 28px;background-color:${BRAND.footer_bg};border-top:1px solid ${BRAND.rule};font-size:11px;color:${BRAND.subtle};text-align:center;">
        TSD Modernization Solutions &middot; Chat Agent &middot;
        <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:${BRAND.muted};">${escapeHtml(conversationId || "unknown")}</code>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text =
    formatPlainTextSummary({
      visitorName,
      visitorEmail,
      businessName,
      summary,
      pageUrl,
      startedAt,
      leadCaptured,
      conversationId,
    }) +
    "\n\n" +
    formatPlainTextTranscript(messages) +
    "\n";

  const subject = `[Chat agent] New chat from ${headerName}`;

  return { subject, html, text, logoBytes, logoCid };
}
