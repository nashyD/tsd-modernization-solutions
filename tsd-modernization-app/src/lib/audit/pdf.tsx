import "server-only";
import puppeteer, {
  type Browser,
  type LaunchOptions,
} from "puppeteer-core";
import type { AuditScores } from "@/lib/audit/types";
import { PACKAGES } from "@/lib/packages";

/**
 * Audit-report PDF: a real HTML/CSS document rendered to PDF by headless
 * Chromium. The HTML is built from tagged template literals — Next 16's
 * Turbopack puts app-route modules in "react-server" mode where
 * `react-dom/server` exports are stubbed out, so React-rendered HTML
 * isn't on the table here. Tagged literals also keep the template
 * dependency-free and easy to reason about.
 *
 * Why HTML and not @react-pdf/renderer:
 *  - Real CSS — gradients, radial glows, true font shaping, proper spacing.
 *  - The TSD prism logo (skewX(-12), 4-slab gradient) drops in as the same
 *    SVG that ships in the live site.
 *  - Inter + Space Grotesk via Google Fonts give us the marketing site's
 *    type system inside the PDF.
 *
 * Cost:
 *  - `@sparticuz/chromium` adds ~57MB to the function bundle. Marked
 *    serverExternal in next.config.ts so it's not Turbopack-bundled.
 *  - Cold-start ~3-4s on Vercel. Acceptable for a download endpoint.
 */

// =====================================================================
// Domain helpers
// =====================================================================

const PILLAR_LABELS: Record<keyof AuditScores["pillar_scores"], string> = {
  website: "Website",
  google: "Google",
  reviews: "Reviews",
  trust: "Trust",
  conversion: "Convert",
};

const SERVICE_LABELS: Record<
  AuditScores["tsd_services"][number]["service"],
  string
> = {
  website_rebuild: "Website rebuild",
  ai_chatbot: "AI chatbot",
  ai_receptionist: "AI receptionist",
  automation: "Workflow automation",
  seo_local: "Local SEO",
  review_management: "Review management",
  audit_only: "Discovery audit",
};

function severityRank(s: AuditScores["gaps"][number]["severity"]) {
  switch (s) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
  }
}

function severityClass(s: AuditScores["gaps"][number]["severity"]): string {
  switch (s) {
    case "critical":
      return "badge-critical";
    case "high":
      return "badge-high";
    case "medium":
      return "badge-medium";
    case "low":
      return "badge-low";
  }
}

// HTML-safe escape for interpolated content (business name, summaries,
// gap titles, etc. — anything user-supplied). Apostrophes are escaped
// to prevent any chance of attribute breakout if the same helper is ever
// used inside an HTML attribute.
function esc(input: string | null | undefined): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Gap "impact" text is LLM-generated and arrives at variable length — often
// three or four sentences. The page-1 findings list budgets ~2 lines per
// gap, so trim each impact down to the most whole sentences that fit.
// Trimming on sentence boundaries keeps every shown impact a complete
// thought; the full untrimmed text still renders on the on-screen report.
const IMPACT_CHAR_BUDGET = 200;

function trimImpact(input: string): string {
  const text = input.trim();
  if (text.length <= IMPACT_CHAR_BUDGET) return text;

  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > IMPACT_CHAR_BUDGET) break;
    out = next;
  }

  // A single run-on first sentence can still exceed the budget — hard-trim
  // it at a word boundary so an impact can never spill past two lines.
  if (!out) {
    const clipped = text.slice(0, IMPACT_CHAR_BUDGET);
    const lastSpace = clipped.lastIndexOf(" ");
    out = `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
  }
  return out;
}

// =====================================================================
// SVG: TSD prism + letters (matches src/components/ui/Logo.tsx,
// which itself mirrors tsd-modernization/public/tsd-ms-logo-tarheel.svg).
// =====================================================================

function tsdPrismSvg(height = 36): string {
  const width = Math.round(height * (338 / 160));
  return `
    <svg viewBox="191 40 338 160" width="${width}" height="${height}" role="img" aria-label="TSD">
      <g transform="translate(225 40) skewX(-12)">
        <rect x="0" y="0" width="76" height="160" rx="4" fill="#a8d1ed" />
        <rect x="76" y="0" width="76" height="160" rx="4" fill="#7BB8E0" />
        <rect x="152" y="0" width="76" height="160" rx="4" fill="#2c5f8a" />
        <rect x="228" y="0" width="76" height="160" rx="4" fill="#13294B" />
      </g>
      <g font-family="'Inter', sans-serif" font-weight="700" fill="#fff" letter-spacing="3">
        <text x="255" y="150" font-size="66">T</text>
        <text x="331" y="150" font-size="66">S</text>
        <text x="407" y="150" font-size="66">D</text>
      </g>
    </svg>`;
}

// =====================================================================
// CSS — single string, dropped verbatim into <style>.
// =====================================================================

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

@page { size: Letter; margin: 0; }

* { box-sizing: border-box; margin: 0; padding: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }

html, body { background: #ffffff; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  color: #0f172a;
  font-size: 10.5pt;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.display {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  letter-spacing: -0.02em;
}

/* ---------- Page ---------- */
.page {
  width: 8.5in;
  height: 11in;
  padding: 0.55in 0.6in 0.42in 0.6in;
  page-break-after: always;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  background-image:
    radial-gradient(circle at 0% 0%, rgba(75,156,211,0.04) 0%, transparent 35%),
    radial-gradient(circle at 100% 0%, rgba(19,41,75,0.03) 0%, transparent 35%);
  overflow: hidden;
}
.page:last-child { page-break-after: auto; }

/* Body holds everything above the footer. flex:1 pushes the footer to the
   page bottom; overflow:hidden means worst-case overflow clips cleanly
   above the footer instead of printing on top of it. */
.page-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

/* ---------- Topbar ---------- */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}
.brand { display: flex; align-items: center; gap: 11px; }
.brand-text {
  font-size: 10.5pt;
  font-weight: 600;
  color: #13294b;
  letter-spacing: -0.005em;
  white-space: nowrap;
}
.topbar-meta {
  font-size: 8pt;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* ---------- Hero ---------- */
.eyebrow {
  font-size: 8pt;
  font-weight: 700;
  color: #4b9cd3;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.business-name {
  font-size: 34pt;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.04;
  letter-spacing: -0.024em;
  margin-bottom: 12px;
}
.summary {
  font-size: 12pt;
  color: #475569;
  line-height: 1.5;
  max-width: 6.6in;
  margin-bottom: 22px;
}

/* ---------- Score panel ---------- */
.score-panel {
  position: relative;
  background: linear-gradient(135deg, #0c1f3d 0%, #13294b 50%, #1f3666 100%);
  color: #ffffff;
  border-radius: 14px;
  padding: 24px 28px;
  display: grid;
  grid-template-columns: 1.05fr 2fr;
  gap: 28px;
  align-items: center;
  margin-bottom: 28px;
  box-shadow:
    0 1px 0 rgba(168,209,237,0.12) inset,
    0 18px 40px -20px rgba(19,41,75,0.45);
  overflow: hidden;
}
.score-panel::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(75,156,211,0.42) 0%, transparent 65%);
  pointer-events: none;
}
.score-panel::after {
  content: '';
  position: absolute;
  bottom: -100px; left: -50px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(168,209,237,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.score-block { position: relative; z-index: 1; }
.score-label {
  font-size: 7.5pt;
  font-weight: 700;
  color: #a8d1ed;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.score-value {
  font-size: 64pt;
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.05em;
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}
.score-of {
  font-size: 18pt;
  color: rgba(168,209,237,0.7);
  font-weight: 500;
  letter-spacing: -0.01em;
}
.score-tagline {
  font-size: 9pt;
  color: rgba(232,244,251,0.7);
  margin-top: 6px;
}
.pillars {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  position: relative;
  z-index: 1;
}
.pillar {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(168,209,237,0.18);
  border-radius: 9px;
  padding: 11px 10px 12px;
}
.pillar-label {
  font-size: 6.5pt;
  font-weight: 700;
  color: #a8d1ed;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.pillar-value {
  font-size: 19pt;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #ffffff;
}

/* ---------- Sections ---------- */
.section-eyebrow {
  font-size: 7.5pt;
  font-weight: 700;
  color: #4b9cd3;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.section-header {
  font-size: 17pt;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.018em;
  margin-bottom: 10px;
}

/* ---------- Gaps ---------- */
.gap {
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 16px 15px;
  margin-bottom: 12px;
  background: #ffffff;
  break-inside: avoid;
}
.gap-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.gap-title {
  font-size: 11pt;
  font-weight: 600;
  color: #0f172a;
  flex: 1;
  line-height: 1.3;
}
.badge {
  font-size: 7pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 999px;
  flex: 0 0 auto;
  white-space: nowrap;
}
.badge-critical { background: #fee2e2; color: #b91c1c; }
.badge-high     { background: #fef3c7; color: #b45309; }
.badge-medium,
.badge-low      { background: #f1f5f9; color: #64748b; }
.gap-impact {
  font-size: 9.5pt;
  color: #334155;
  line-height: 1.45;
  margin-top: 6px;
}
.gap-impact .label { color: #0f172a; font-weight: 600; }

/* ---------- Recommended package ---------- */
.pkg-card {
  position: relative;
  border: 2px solid #4b9cd3;
  border-radius: 16px;
  padding: 22px 30px 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbfd 100%);
  box-shadow:
    0 0 0 4px rgba(75,156,211,0.08),
    0 1px 0 rgba(75,156,211,0.18) inset;
  margin-bottom: 14px;
  overflow: hidden;
  break-inside: avoid;
}
.pkg-card::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(75,156,211,0.18) 0%, transparent 65%);
  pointer-events: none;
}
.pkg-card > * { position: relative; z-index: 1; }
.pkg-eyebrow-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}
.pkg-eyebrow {
  font-size: 7.5pt;
  font-weight: 700;
  color: #4b9cd3;
  background: #e8f4fb;
  border: 1px solid rgba(75,156,211,0.25);
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.pkg-cap {
  font-size: 7.5pt;
  font-weight: 700;
  color: #13294b;
  background: #e2e8f0;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.pkg-name {
  font-size: 26pt;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.022em;
  margin-bottom: 8px;
}
.pkg-price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 10px;
}
.pkg-price {
  font-size: 30pt;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.035em;
}
.pkg-anchor {
  font-size: 13pt;
  color: #94a3b8;
  text-decoration: line-through;
}
.pkg-tagline {
  font-size: 11pt;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 12px;
  max-width: 6.4in;
}
.pkg-services-label {
  font-size: 7.5pt;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.pkg-services { list-style: none; }
.pkg-service {
  display: flex;
  gap: 11px;
  padding: 4px 0;
  font-size: 10.5pt;
  color: #475569;
  line-height: 1.5;
}
.pkg-service::before {
  content: '';
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  background: #4b9cd3;
  border-radius: 50%;
  margin-top: 7px;
}
.pkg-service-text { flex: 1; }
.pkg-service-text strong { color: #0f172a; font-weight: 600; }
.pkg-guarantee {
  margin-top: 12px;
  padding: 12px 14px 13px;
  background: #f0f9f1;
  border-left: 3px solid #15803d;
  border-radius: 6px;
}
.pkg-guarantee-label {
  font-size: 7.5pt;
  font-weight: 700;
  color: #15803d;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.pkg-guarantee-text {
  font-size: 9.5pt;
  color: #1f3923;
  line-height: 1.5;
}

/* ---------- CTA ---------- */
.cta-bar {
  position: relative;
  background: linear-gradient(135deg, #0c1f3d 0%, #13294b 55%, #1f3666 100%);
  border-radius: 14px;
  padding: 18px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  overflow: hidden;
  box-shadow: 0 12px 28px -16px rgba(19,41,75,0.5);
}
.cta-bar::before {
  content: '';
  position: absolute;
  bottom: -60px; right: -40px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(75,156,211,0.32) 0%, transparent 65%);
  pointer-events: none;
}
.cta-bar > * { position: relative; z-index: 1; }
.cta-primary {
  font-size: 16pt;
  font-weight: 600;
  letter-spacing: -0.012em;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cta-primary .arrow {
  display: inline-block;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #4b9cd3;
  color: #0c1f3d;
  font-size: 10pt;
  font-weight: 700;
  text-align: center;
  line-height: 20px;
}
.cta-url {
  font-size: 9pt;
  color: #a8d1ed;
  margin-top: 4px;
  letter-spacing: 0.02em;
}
.cta-scarcity { text-align: right; }
.cta-scarcity-line {
  font-size: 9.5pt;
  font-weight: 600;
  color: #a8d1ed;
  letter-spacing: 0.04em;
}
.cta-scarcity-hint {
  font-size: 8pt;
  color: rgba(168,209,237,0.55);
  margin-top: 3px;
}

/* ---------- Footer ---------- */
.footer {
  flex: 0 0 auto;
  margin-top: 16px;
  padding-top: 11px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 7.5pt;
  color: #94a3b8;
  letter-spacing: 0.04em;
}
.footer .domain { color: #4b9cd3; font-weight: 600; }
`;

// =====================================================================
// Template
// =====================================================================

interface AuditPdfHtmlProps {
  businessName: string;
  scores: AuditScores;
  generatedAt: Date;
}

function topbar(dateStr: string): string {
  return `
    <div class="topbar">
      <div class="brand">
        ${tsdPrismSvg(36)}
        <span class="brand-text">TSD Modernization Solutions</span>
      </div>
      <div class="topbar-meta">${esc(dateStr)}</div>
    </div>`;
}

function buildAuditHtml({
  businessName,
  scores,
  generatedAt,
}: AuditPdfHtmlProps): string {
  const pkg = PACKAGES[scores.recommended_package];
  const topGaps = [...scores.gaps]
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .slice(0, 4);
  const dateStr = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const pillarMarkup = (
    Object.entries(scores.pillar_scores) as [
      keyof AuditScores["pillar_scores"],
      number,
    ][]
  )
    .map(
      ([k, v]) => `
        <div class="pillar">
          <div class="pillar-label">${esc(PILLAR_LABELS[k])}</div>
          <div class="pillar-value display">${v}</div>
        </div>`
    )
    .join("");

  const gapsMarkup = topGaps
    .map(
      (g) => `
        <div class="gap">
          <div class="gap-row">
            <div class="gap-title">${esc(g.title)}</div>
            <span class="badge ${severityClass(g.severity)}">${esc(g.severity)}</span>
          </div>
          ${
            g.impact
              ? `<div class="gap-impact"><span class="label">Impact: </span>${esc(trimImpact(g.impact))}</div>`
              : ""
          }
        </div>`
    )
    .join("");

  const servicesMarkup = scores.tsd_services
    .map(
      (s) => `
        <li class="pkg-service">
          <span class="pkg-service-text">
            <strong>${esc(SERVICE_LABELS[s.service])}.</strong> ${esc(s.rationale)}
          </span>
        </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${esc(businessName)} — TSD Modernization Audit</title>
    <style>${CSS}</style>
  </head>
  <body>
    <!-- ============ PAGE 1 — score + gaps ============ -->
    <div class="page">
      <div class="page-body">
        ${topbar(dateStr)}

        <div class="eyebrow">Modernization audit</div>
        <h1 class="business-name display">${esc(businessName)}</h1>
        <p class="summary">${esc(scores.one_line_summary)}</p>

        <div class="score-panel">
          <div class="score-block">
            <div class="score-label">Presence Score</div>
            <div class="score-value display">
              ${scores.presence_score}<span class="score-of">/ 100</span>
            </div>
            <div class="score-tagline">
              Composite of website, Google, reviews, trust, conversion.
            </div>
          </div>
          <div class="pillars">${pillarMarkup}</div>
        </div>

        <div class="section-eyebrow">Findings</div>
        <h2 class="section-header display">What we found</h2>
        ${gapsMarkup}
      </div>

      <div class="footer">
        <span>TSD Modernization Solutions · <span class="domain">tsd-modernization.com/audit</span></span>
        <span>Page 1 of 2</span>
      </div>
    </div>

    <!-- ============ PAGE 2 — recommended package + CTA ============ -->
    <div class="page">
      <div class="page-body">
        ${topbar(dateStr)}

        <div class="section-eyebrow">Recommended next step</div>
        <h2 class="section-header display">Here&rsquo;s where we&rsquo;d start</h2>

        <div class="pkg-card">
          <div class="pkg-eyebrow-row">
            <span class="pkg-eyebrow">Recommended package</span>
            ${pkg.cap ? `<span class="pkg-cap">${esc(pkg.cap)}</span>` : ""}
          </div>
          <h3 class="pkg-name display">${esc(pkg.name)}</h3>
          <div class="pkg-price-row">
            <span class="pkg-price display">${esc(pkg.price)}</span>
            ${pkg.anchor ? `<span class="pkg-anchor">${esc(pkg.anchor)}</span>` : ""}
          </div>
          <p class="pkg-tagline">${esc(pkg.tagline)}</p>

          <div class="pkg-services-label">What we&rsquo;d ship</div>
          <ul class="pkg-services">${servicesMarkup}</ul>

          ${
            pkg.guarantee
              ? `<div class="pkg-guarantee">
                   <div class="pkg-guarantee-label">Our guarantee</div>
                   <div class="pkg-guarantee-text">${esc(pkg.guarantee)}</div>
                 </div>`
              : ""
          }
        </div>

        <div class="cta-bar">
          <div>
            <div class="cta-primary">Book a free fit call <span class="arrow">&rsaquo;</span></div>
            <div class="cta-url">tsd-modernization.com/book</div>
          </div>
          <div class="cta-scarcity">
            <div class="cta-scarcity-line">Cohort closes Aug 10, 2026</div>
            <div class="cta-scarcity-hint">Last project start July 13</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <span>Prepared ${esc(dateStr)} · <span class="domain">tsd-modernization.com</span></span>
        <span>Page 2 of 2</span>
      </div>
    </div>
  </body>
</html>`;
}

// =====================================================================
// Renderer
// =====================================================================

const LOCAL_CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter((p): p is string => typeof p === "string" && p.length > 0);

async function getBrowser(): Promise<Browser> {
  const isServerless =
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.AWS_REGION;

  if (isServerless) {
    // `@sparticuz/chromium-min` is the bundler-friendly variant: the JS
    // module is tiny (~50KB) and ships *no* binary blobs. We pass the
    // GitHub-releases URL of the matching v148 chromium pack to
    // `executablePath()`, which downloads + extracts the ~50MB tarball
    // into /tmp on first invoke and reuses it on warm invokes within the
    // same lambda lifetime. This sidesteps the
    // `outputFileTracingIncludes` rabbit hole that doesn't reliably
    // include the bin/ folder under Next 16 + Turbopack.
    //
    // Version pin: this URL must match the @sparticuz/chromium-min
    // version in package.json — they're released together. Bump both
    // together.
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const CHROMIUM_PACK_URL =
      "https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar";
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: "shell",
    } satisfies LaunchOptions);
  }

  // Local dev — try common Chrome install paths.
  let lastErr: unknown = null;
  for (const executablePath of LOCAL_CHROME_CANDIDATES) {
    try {
      return await puppeteer.launch({
        executablePath,
        headless: true,
      });
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(
    `No local Chrome/Chromium found. Set PUPPETEER_EXECUTABLE_PATH. Last error: ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`
  );
}

export interface RenderAuditPdfOptions {
  businessName: string;
  scores: AuditScores;
  generatedAt: Date;
}

export async function renderAuditPdf(
  opts: RenderAuditPdfOptions
): Promise<Buffer> {
  const html = buildAuditHtml(opts);

  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    // Letter at 96 CSS px/in. Helps Chromium lay out at the correct scale
    // before `page.pdf` re-rasters at the @page-declared size.
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 25_000,
    });
    // Belt-and-suspenders: wait for Google Fonts to actually shape.
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    });

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => {});
  }
}
