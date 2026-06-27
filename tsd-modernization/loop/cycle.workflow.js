export const meta = {
  name: 'improve-tsd-cycle',
  description: 'Loop-Engineering cycle: elite specialist lenses diagnose tsd-modernization.com, an independent verifier confirms each finding, synthesis ranks a backlog',
  phases: [
    { title: 'Diagnose', detail: '7 elite specialist lenses find concrete improvements' },
    { title: 'Verify', detail: 'independent verifier confirms/rejects each finding (creator != verifier)' },
    { title: 'Synthesize', detail: 'rank a prioritized backlog + pick top safe wins' },
  ],
}

const REPO = "/Users/nashdavis/Documents/TSD/TSD Modernization Solution/Modernization Solutions Site/tsd-modernization/tsd-modernization"

const CONTEXT = `
SITE: TSD Modernization Solutions — public marketing storefront, live at https://www.tsd-modernization.com
REPO (the marketing site — read/cite ONLY files under here, path has spaces so quote it): "${REPO}"
STACK: Vite + React 18 + react-router-dom, prerendered with vite-react-ssg (static SSG). Sentry + @vercel/analytics. This is NOT Next.js. A separate Next.js app lives at ../tsd-modernization-app and serves /audit /app /sales /demos via Vercel rewrites — DO NOT analyze or touch it; stay in the Vite repo above.
KEY FILES:
- src/pages/Home.jsx (homepage), src/Layout.jsx (app shell + per-route <Head> meta via ROUTE_META), src/routes.jsx, src/route-jsonld.js, src/main.jsx
- pages: Services.jsx, ServiceDetail.jsx, Pricing.jsx, Process.jsx, WhyUs.jsx, Savings.jsx, Team.jsx, Testimonials.jsx, Contact.jsx, Book.jsx, Demo.jsx, News.jsx, NewsDetail.jsx, RelationshipPage.jsx, PageShell.jsx
- data: src/services-data.js, src/relationships-data.js, src/news-data.js
- components: BookCallButton.jsx, CallButton.jsx, ChatbotDemo.jsx, MakeFlowDemo.jsx, PricingEstimator.jsx, TSDAgent.jsx
- index.html (site-level meta + JSON-LD ProfessionalService; loads Google Fonts: Inter + Playfair Display + Cormorant Garamond)
- public/: hero-loop.mp4 (+ hero-loop-mobile.mp4 + .webp posters), og-image.png, sitemap.xml, robots.txt, llms.txt
POSITIONING (do NOT dilute): money-saver "find the leak" wedge. Hero H1: "We find the leak. You outrun the franchise." Four SKUs: TSD Front Desk, TSD Concierge, TSD Lead Engine, custom websites. Audience: established Charlotte-metro local & trade businesses with good reputations but dated tech. Offer cues: 48-hour proposals, AI from $73/mo, a free cost-cut audit, money-back guarantee.
VOICE RULES (hard constraints for any copy suggestion): NO em dashes; NEVER the "X, not Y" contrastive construction; no colon-lists, no three-part closers, no buzzwords. Copy must read like a real person wrote it.
GOVERNANCE: BUSINESS_PLAN.md is the source of truth and .claude/CLAUDE.md requires copy/pricing/positioning edits to stay consistent with it. If a finding would require a plan update, say so.
`

const FINDINGS_SCHEMA = {
  type: 'object', required: ['lens', 'findings'], additionalProperties: false,
  properties: {
    lens: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','problem','evidence','recommendation','impact','effort','confidence','safeToAutomate'],
        properties: {
          title: { type: 'string' },
          problem: { type: 'string', description: 'what is wrong / the leak' },
          evidence: { type: 'string', description: 'file:line and a quoted snippet, or a live URL + what was observed' },
          recommendation: { type: 'string', description: 'the concrete change to make' },
          impact: { enum: ['high','medium','low'] },
          effort: { enum: ['S','M','L'] },
          confidence: { enum: ['high','medium','low'] },
          safeToAutomate: { type: 'boolean', description: 'true ONLY if a small, self-contained, low-risk change an agent could safely make without product judgment' },
        },
      },
    },
  },
}

const VERIFY_SCHEMA = {
  type: 'object', required: ['lens','verified'], additionalProperties: false,
  properties: {
    lens: { type: 'string' },
    verified: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','verdict','problem','evidence','recommendation','impact','effort','confidence','safeToAutomate','note'],
        properties: {
          title: { type: 'string' },
          verdict: { enum: ['confirmed','rejected','adjusted'] },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          recommendation: { type: 'string' },
          impact: { enum: ['high','medium','low'] },
          effort: { enum: ['S','M','L'] },
          confidence: { enum: ['high','medium','low'] },
          safeToAutomate: { type: 'boolean' },
          note: { type: 'string', description: 'why confirmed/rejected/adjusted; cite what you checked' },
        },
      },
    },
  },
}

const LENSES = [
  { key: 'conversion', title: 'Conversion-Rate & Offer Optimizer (Hormozi/Marc-Lou lens)',
    brief: 'Find friction and leaks in the path from landing to "Book a fit call". Weak/buried CTAs, offer clarity, risk-reversal placement, trust gaps, form friction on Book.jsx/Contact.jsx, pricing legibility on Pricing.jsx/PricingEstimator.jsx, missing social proof, above-the-fold clarity, mobile CTA reachability. What is costing booked calls?' },
  { key: 'copy-voice', title: 'Positioning & Copy editor (April-Dunford + the-humanizer lens)',
    brief: 'Audit headline/subhead clarity and differentiation, scan ALL visible copy for AI-tells and the banned voice patterns (em dashes, "X not Y", colon-lists, three-part closers, buzzwords), check the positioning is sharp and consistent across pages, and flag any vague or generic line. Quote the offending text.' },
  { key: 'seo', title: 'Technical & On-page SEO specialist',
    brief: 'Check per-route <title>/meta description coverage in ROUTE_META (Layout.jsx), canonical/OG/Twitter per route, JSON-LD completeness/correctness (index.html + route-jsonld.js), heading hierarchy (single H1, logical h2/h3), internal linking, image alt text, sitemap.xml / robots.txt / llms.txt correctness, and any route missing unique metadata. Identify concrete gaps that suppress local/organic ranking.' },
  { key: 'performance', title: 'Core Web Vitals / performance engineer',
    brief: 'Find LCP/CLS/INP and payload risks: render-blocking Google Fonts (3 families), hero video weight and whether it blocks LCP / lacks preload/poster discipline, images not in modern formats or missing width/height (CLS), missing lazy-loading, heavy client components on the SSG marketing pages, font-display, preconnect/preload opportunities, and bundle bloat. Read vite.config, index.html, Home.jsx, Layout.jsx.' },
  { key: 'accessibility', title: 'WCAG 2.2 AA accessibility auditor',
    brief: 'Find concrete a11y defects: color-contrast risks, missing/!poor alt text, focus-visible states, keyboard operability of custom buttons/menus, aria labeling, semantic landmarks, the autoplaying hero video (controls / prefers-reduced-motion / no captions), form labels on Book/Contact, and link text quality. Cite file:line.' },
  { key: 'design-ux', title: 'Senior UI/UX designer',
    brief: 'Find visual-hierarchy, spacing, consistency, and mobile-layout issues that cheapen the premium feel: inconsistent spacing/type scale, weak section rhythm, mobile breakpoints, interaction/hover/active states, hero effectiveness, and any component that looks unfinished. Favor high-craft, low-risk polish.' },
  { key: 'correctness', title: 'Technical correctness / bug hunter',
    brief: 'Find real defects: dead or wrong links, broken/duplicate routes, SSG hydration mismatches, unhandled errors, stale or placeholder data in services-data/news-data/relationships-data, TODO/FIXME, console-error risks, mismatched phone numbers/emails vs the canonical company line (+1-980-890-5815), and anything factually broken. Cite file:line.' },
]

phase('Diagnose')

const results = await pipeline(
  LENSES,
  (lens) => agent(
    `${CONTEXT}\n\nYou are the ${lens.title}. This is one lens of an elite team improving the live site.\nYOUR JOB: ${lens.brief}\n\nActually open and read the relevant files in the repo (quote the path, it has spaces). Return your 4 to 7 HIGHEST-leverage, concrete, real findings — quality over quantity, no padding, no speculative nice-to-haves you cannot ground in the code. Every finding must cite specific evidence (file:line + quoted snippet, or a precise live-site observation). Set safeToAutomate=true ONLY for small self-contained low-risk changes that need no product judgment. Set lens to "${lens.key}".`,
    { label: `diagnose:${lens.key}`, phase: 'Diagnose', schema: FINDINGS_SCHEMA }
  ),
  (diag, lens) => {
    if (!diag || !diag.findings || !diag.findings.length) return { lens: lens.key, verified: [] }
    return agent(
      `${CONTEXT}\n\nYou are an INDEPENDENT VERIFIER. You did NOT write the findings below — your job is to be skeptical and protect the backlog from noise. For EACH finding: open the cited file/evidence and confirm the problem is real AND currently present (not already handled). Confirm the recommendation is correct, safe, and consistent with the positioning and voice rules. Re-score impact/effort if mis-rated. Reject anything you cannot verify from the actual code, anything already fixed, anything that violates the voice rules, or any "improvement" that is merely subjective with no real upside. Default to REJECTED when in doubt.\n\nFINDINGS TO VERIFY (lens "${lens.key}"):\n${JSON.stringify(diag.findings, null, 2)}\n\nReturn every finding with a verdict (confirmed | adjusted | rejected) and a note citing what you checked. Keep the (possibly adjusted) fields. Set lens to "${lens.key}".`,
      { label: `verify:${lens.key}`, phase: 'Verify', schema: VERIFY_SCHEMA }
    )
  }
)

phase('Synthesize')

const allVerified = results
  .filter(Boolean)
  .flatMap(r => (r.verified || []).map(v => ({ ...v, lens: r.lens })))
  .filter(v => v.verdict !== 'rejected')

const impactW = { high: 3, medium: 2, low: 1 }
const effortW = { S: 3, M: 2, L: 1 }
const confW = { high: 2, medium: 1, low: 0 }
const ranked = allVerified
  .map(v => ({ ...v, score: impactW[v.impact] * 2 + effortW[v.effort] + confW[v.confidence] }))
  .sort((a, b) => b.score - a.score)

const rejectedCount = results.filter(Boolean).flatMap(r => r.verified || []).filter(v => v.verdict === 'rejected').length

log(`Verified ${ranked.length} findings across ${LENSES.length} lenses; verifier rejected ${rejectedCount}.`)

const SYNTH_SCHEMA = {
  type: 'object', required: ['summary','topSafeWins','boardMarkdown'], additionalProperties: false,
  properties: {
    summary: { type: 'string', description: '4-6 sentence executive read on the site health and where the leverage is' },
    topSafeWins: {
      type: 'array', description: '3 to 6 confirmed, safeToAutomate, high impact-to-effort items to implement THIS cycle',
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','lens','files','change','why','impact','effort'],
        properties: {
          title: { type: 'string' }, lens: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } },
          change: { type: 'string', description: 'the precise edit to make' },
          why: { type: 'string' }, impact: { enum: ['high','medium','low'] }, effort: { enum: ['S','M','L'] },
        },
      },
    },
    boardMarkdown: { type: 'string', description: 'a clean GitHub-flavored markdown backlog: a table of ALL verified findings grouped by impact, each with lens, problem, recommendation, evidence, impact, effort, and a [ ] checkbox. This becomes the persistent State board.' },
  },
}

const synthesis = await agent(
  `${CONTEXT}\n\nYou are the lead synthesizer closing this Loop-Engineering cycle. Below are ${ranked.length} verifier-confirmed findings (pre-sorted by a leverage score) for the live marketing site.\n\nProduce: (1) a tight executive summary of site health and where the real leverage is; (2) topSafeWins — the 3 to 6 BEST items that are confirmed, marked safeToAutomate, and high impact-to-effort, that a careful agent should implement THIS cycle on a review branch (prefer SEO/perf/a11y/correctness wins that do not require product or pricing judgment; be conservative with copy changes and never violate the voice rules); (3) boardMarkdown — the full prioritized backlog as a clean markdown board.\n\nCONFIRMED FINDINGS:\n${JSON.stringify(ranked, null, 2)}`,
  { label: 'synthesize', phase: 'Synthesize', schema: SYNTH_SCHEMA }
)

return { stats: { verified: ranked.length, rejected: rejectedCount, lenses: LENSES.length }, ranked, synthesis }
