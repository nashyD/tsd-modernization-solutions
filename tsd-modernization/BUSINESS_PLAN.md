# TSD Modernization Solutions — Business Plan

*Extracted from [github.com/nashyD/tsd-modernization-solutions/tree/main/tsd-modernization](https://github.com/nashyD/tsd-modernization-solutions/tree/main/tsd-modernization) on 2026-04-26; refreshed against live source on 2026-05-02 (Phase II bundle raised to $5,000 founding rate / $10,000 anchor + Phase II guarantee replaced with two operationalizable triggers + wedge decoupled from the bundle with a $1,000-off-within-30-days credit + Founding Partnership raised to $10,000 / $20,000 anchor with new scope and outcome guarantee + Phase I discovery audit demoted from a public tier card to a stepping-stone offer, all per Hormozi-style audit; prior changes: pricing restructure, vertical reframe, Twilio→Telnyx migration, route additions, Calendly booking funnel). Sourced from `README.md`, `index.html` (JSON-LD), all page components in `src/pages/`, `services-data.js`, and the `PROJECT_LOG.md` audit/changelog.*

---

## 1. Executive Summary

**TSD Modernization Solutions** is a summer-only (May 7 – August 10, 2026) tech-modernization service for Charlotte-area small businesses. Three founders, hard cap of ten Phase II clients (with three additional Founding Partnership slots), two public packaged tiers (Phase II Bundle at $5,000, Founding Partnership at $10,000) plus a $497 wedge product on `/ai-receptionist`. A $1,500 discovery audit exists as a stepping-stone offer for qualifying conversations only — pulled from public `/pricing` tier cards on 2026-05-02 per the Hormozi-style audit.

The thesis: ~50,000 small businesses in the Charlotte metro, fewer than 30% with modern tools — a gap caused by agency pricing, not buyer reluctance. TSD bills at "main-street prices" (founding-cohort rates explicitly set at half of standard), guarantees a 48-hour written proposal, ships in 2–4 weeks, and backs every engagement with a 100% money-back guarantee.

Legal entity: **TSD Ventures, LLC**. "TSD Modernization Solutions" is one of two operating brands under the LLC (the other is TSD Mobile Detailing); neither is a separate legal entity. No d/b/a filed yet, so binding contracts are signed as TSD Ventures, LLC; marketing and chat copy use the brand name freely.

---

## 2. Company Overview

| | |
|---|---|
| **Legal entity** | TSD Ventures, LLC (NC) |
| **Operating brand** | TSD Modernization Solutions |
| **Website** | https://tsd-modernization.com |
| **Phone** | +1 (704) 317-5630 (Telnyx; replaced the (704) 275-1410 GV line on 2026-04-27, then the brief (704) 741-1746 Twilio line on 2026-04-28) |
| **Hours** | Every day, 8am – 8pm |
| **Service area** | Charlotte, Gastonia, Belmont (NC) — service-area business, no storefront |
| **Operating window** | May 7 – August 10, 2026 (handoff). On-call through August 31, 2026. |
| **Last project start** | July 13, 2026 |
| **Cohort cap** | 10 Phase II Bundle spots + 3 Founding Partnership spots |

Schema.org type on the live site: `ProfessionalService` with `priceRange` `$1500 – $5000`.

---

## 3. Founders & Roles

All three founders attend different UNC-system schools but grew up within twenty minutes of each other in the Carolina piedmont. Promise to clients: "When you hire TSD, you hire these three people — no account managers, no offshoring, no handoffs."

| # | Name | Role | School | Email | Owns |
|---|---|---|---|---|---|
| 01 | **Nash Davis** | CEO & Head of Modernization | UNC Chapel Hill | nashdavis@tsd-ventures.com | Custom AI chatbots & integrations · Site architecture & build · Solution scoping and delivery |
| 02 | **Bishop Switzer** | COO — Operations | UNC Wilmington | bishopswitzer@tsd-ventures.com | Project tracking & timelines · Proposals & invoicing · Handoff documentation & training |
| 03 | **Grant Tadlock** | CFO & Sales Lead | UNC Charlotte | granttadlock@tsd-ventures.com | Financial planning & pricing · Sales pipeline & intake · Client relationships |

Founder pull-quotes (positioning):
- Nash: *"When it breaks, you call me — not a ticket queue."*
- Bishop: *"Every proposal is documented. Every handoff is yours to keep."*
- Grant: *"Main-street pricing is a promise, not a pitch."*

---

## 4. Market & Opportunity

**TAM (Charlotte metro):** ~50,000 small businesses. Fewer than 30% have modern tools — the stated thesis is that this gap is access (agency pricing + freelancer disappearance), not reluctance.

**Vertical positioning (re-narrowed 2026-04-26 after a brief broadening pass):**

- **Homepage / paid-traffic wedge:** Charlotte trades — *HVAC · Electrical · Plumbing · Garage Doors · Roofing · Home Services*. The "Built for the trades" strip sits directly under the hero. The 2026-04-25 broaden-to-multi-vertical decision was reversed the next day in favor of a sharper wedge for cold traffic.
- **Trade-specific landing pages:** `/hvac`, `/electricians`, `/plumbers` — each with copy tuned to that trade's after-hours pain. Destinations for paid Facebook + Google Local against trades keywords.
- **Relationship-channel landing pages:** `/salons`, `/auto-shops`, `/restaurants` — for non-trades verticals reached through founder DMs / personal networks. Same offer, different framing. Three of four pre-launch warm leads sit on these channels (salon, auto, bakery).
- **AI Receptionist wedge page (`/ai-receptionist`):** Hard-committed to HVAC + trades. The $497-entry funnel that compounds with the trade landing pages.

**Competitive frame** (from `WhyUs.jsx` comparison table):

| Feature | TSD | Agency | Freelancer | DIY |
|---|---|---|---|---|
| Personalized service | ✓ | ✗ | ✓ | ✗ |
| Modern tech stack | ✓ | ✓ | varies | ✗ |
| Full documentation & training | ✓ | extra | ✗ | ✗ |
| Affordable for small business | ✓ | ✗ | ✓ | ✓ |
| AI integration expertise | ✓ | extra | varies | ✗ |
| 48-hour proposal turnaround | ✓ | ✗ | ✗ | n/a |
| Post-launch support | ✓ | extra | varies | ✗ |
| Local (Charlotte area) | ✓ | ✗ | varies | n/a |

---

## 5. Services

Three service categories defined in `src/services-data.js`. All three are bundled into the Phase II offer; the audit (Phase I) can be bought standalone.

### 5.1 AI Integration & Automation
Custom AI chatbots trained on the client's business, Make/Zapier workflows, AI-powered reporting dashboards, calendar/appointment automation, staff training on every tool deployed. Timeline: 1–2 weeks.

### 5.2 Website Creation & Redesign
5–8 page custom React/Vite site, mobile-first, on-page SEO + AI search visibility, Google Analytics + Search Console wiring, contact-form & chatbot integration, written + video handoff documentation. Founder on call for fixes through Aug 31, 2026. Timeline: 2–4 weeks.

### 5.3 Process Modernization
2–3 hour structured tech audit (in-person or remote), written modernization roadmap with cost estimates and ROI per item, prioritized sequence. Audit completed in a single session; written roadmap delivered within 48 hours.

### 5.4 Wedge product — AI Receptionist (`/ai-receptionist`)

A productized, narrow offer aimed at HVAC + trades. The pitch: industry data puts after-hours missed-call rates above 30% for service businesses; voicemail loses leads; a real receptionist's math doesn't carry for a small operator.

**How it works:** After-hours calls forward to a dedicated AI line → AI answers in the business's voice, captures name/service/urgency/address, books from the calendar in real time → owner gets an SMS with the booking + one-paragraph summary; caller gets a confirmation text.

**Included:** Custom AI agent trained on services/hours/pricing · Branded greeting & voice · Google or Apple calendar integration · SMS confirmations both ways · Weekly booking summary · Founder on call through Aug 31, 2026 · Full transfer of credentials and the agent at handoff.

---

## 6. Pricing & Packaging

Two tiers on `/pricing` (Phase II Website + AI Bundle at $5,000, Founding Partnership at $10,000) plus a wedge product on `/ai-receptionist` ($497 AI Receptionist setup). The $1,500 Discovery audit was demoted from a public tier on 2026-05-02 (Path B2 of the Hormozi-style audit) and is now a stepping-stone offer surfaced in qualifying conversations only. All founding-cohort rates are explicitly half of the post-cohort standard, with the standard struck through on the page as the anchor.

### Discovery audit (stepping-stone offer, not on `/pricing` tier cards as of 2026-05-02)
- **Price:** $1,500 founding rate (anchor $3,000) — unchanged from the prior Phase I tier; only the public visibility changed.
- **Deliverable:** 2–3 hour structured tech audit + written modernization roadmap + tool recommendations + priority areas. No obligation to continue.
- **Risk reversal:** Money-back if we can't find $25K of opportunities.
- **Public visibility:** Pulled from `/pricing` tier cards on 2026-05-02 (Path B2 of the Hormozi-style audit). The `/pricing` FAQ mentions it as available on request; the chat agent and the fit-call script offer it case-by-case when one of four triggers fires (prospect explicitly asks for paid discovery, "not ready for full build" signal, Founding Partnership prospect pushing back on the $10K commit, second-opinion ask). Operator playbook lives in [`AUDIT_OFFER_PLAYBOOK.md`](AUDIT_OFFER_PLAYBOOK.md).
- **Continues to be included in:** the Founding Partnership ($10,000) — buyers at that tier still receive the audit as part of the package.
- **Why pulled from public tiers:** Sitting on `/pricing` as a third tier card next to Phase II ($5,000) and Founding Partnership ($10,000) gave hesitant buyers a cheaper escape hatch from the bundle conversation. For prospects who are a clear bundle fit but flinching on price, the audit-as-public-tier was a worse outcome than walking them through their objections — because the audit is a one-time engagement that doesn't build, while Phase II is the actual outcome they wanted. Pulling the audit off the public page commits the funnel to bundle-or-walk-away for the default buyer, while preserving the audit as a sales tool for the buyers it actually fits.

### Phase II — Website + AI Bundle (Featured)
- **Price:** $5,000 founding rate (anchor $10,000) — raised from $2,000 / $4,000 on 2026-05-02 per Hormozi-style audit
- **Cap:** 10 founding-cohort spots
- **Includes:** Custom responsive website · AI chatbot or workflow automation · On-page SEO + analytics · Written + video documentation · Founder on call for fixes through Aug 31, 2026 · Full source-code ownership
- **Wedge credit (replaces the prior bundled "AI Receptionist included" bonus):** Decoupled 2026-05-02 per Hormozi-style audit so the wedge keeps its job (low-friction first yes) and there's a documented upsell path. Wedge customers (anyone who bought the $497 AI Receptionist) save $1,000 on Phase II within 30 days of their setup — Phase II becomes $4,000 instead of $5,000 for them. Surfaced on the Phase II tier card on `/pricing` (in the existing dashed-border bonus block) and the matching `Bundle bonus` strip on `/ai-receptionist`.
- **Risk reversal:** Two operationalizable triggers added 2026-05-02 per Hormozi-style audit, replacing the prior generic "if we missed the mark by handoff" line. (1) Site live within 14 days of contract signature (clock pauses if buyer hasn't delivered content + integration credentials within 7 days of signature) or 25% refund ($1,250). (2) AI captures at least 3 qualified leads in the first 30 days post-launch or refund the AI portion (case-by-case dollar amount per actual AI scope, no public anchor) plus rebuild the AI integration free of additional charge. Qualified-lead definition (name + service request + contact info, captured by the AI integration), verification mechanics, and refund benchmarks live in [`GUARANTEE_VERIFICATION.md`](GUARANTEE_VERIFICATION.md); customer-facing contract clauses in [`contracts/phase-ii-guarantee-terms-2026-05-02.md`](contracts/phase-ii-guarantee-terms-2026-05-02.md) for paste into `agreement-of-work-template.docx`.
- **CTA:** "Claim Founding Spot"

### Founding Partnership (application-only)
- **Price:** $10,000 founding rate (anchor $20,000) — raised from $5,000 / $10,000 on 2026-05-02 per Hormozi-style audit Phase 4 to restore a positive premium over the à la carte component absorption (audit + Phase II + wedge = $6,997).
- **Cap:** 3 founding-partnership spots
- **Includes:** Phase II Website + AI Bundle in full (custom site, AI integration, SEO, analytics, docs, source code yours) · Discovery audit + written modernization roadmap · AI Receptionist setup included · One additional integration into whatever system the client currently uses (ServiceTitan, QuickBooks, Jobber, or another) · Custom AI re-training on real call data starting after week 1, continuing through Aug 31 · Monthly business review with Bishop (1-hour meeting + 24-hour written recap) · Named ops handholding from Bishop (calendar, proposals, weekly status) · Founder on call for fixes through Aug 31, 2026.
- **Risk reversal:** 8+ qualified leads captured by the AI integration in the first 60 days post-launch or 50% refund ($5,000) and the AI integration rebuilt free. Stacks with the Phase II 14-day-or-25%-back delivery guarantee (since Founding Partnership is Phase II in full plus premium adds).
- **CTA:** "Apply for Partnership"
- **Note:** Cancel any time after handoff. No retainer trap.

### Wedge — AI Receptionist setup (`/ai-receptionist`)
- **Price:** $497 founding setup (anchor $1,500) — one-time fee, no recurring charge
- **Cap:** 10 setup spots, last start July 13
- **After Aug 31:** Ownership transfers — buyer owns the agent, credentials, and call log; continues the underlying service directly with their own Telnyx + Deepgram + Anthropic accounts
- **Risk reversal:** If the AI doesn't book a single appointment in the first 30 days, every dollar comes back
- **Bundle upsell:** Wedge buyers can add the Phase II Website + AI Bundle within 30 days of their setup and save $1,000 (Phase II at $4,000 instead of $5,000). The wedge price stays paid; the $1,000 credit applies to Phase II only. Decoupled from Phase II as a separately-priced product on 2026-05-02 — previously Phase II included the wedge as a bundled "$497 value" bonus, which neutered the wedge's job as a low-friction first yes. Surfaced on `/ai-receptionist`'s "Bundle bonus" strip and on the Phase II tier card's bonus block on `/pricing`.

### Risk reversal (all engagements)
> *"You sign the scope. We deliver. If we missed the mark by handoff, every dollar comes back inside a week."*

---

## 7. Operating Model — The Time-Bounded Cohort

This is the structural choice that drives every other decision.

**Why summer-only.** The three founders are in school. The 14-week operating window (May 7 – Aug 10) is dictated by that, and was confirmed/locked on 2026-04-25. The retainer model can't survive a 14-week operating window — there's no "ongoing" relationship to retain. So bundle pricing absorbs full project value rather than relying on retainer LTV.

**Capacity math from the audit:** Three founders × ~30 hrs/project × ~9 weeks of demand window = realistic max 6–10 projects. The "10 spots" cap is honest scarcity, not invented.

**Timeline:**

| Date | Event |
|---|---|
| **May 7, 2026** | Cohort opens. Engagements begin. |
| **July 13, 2026** | Last project start (so a 4-week build still finishes by Aug 10). |
| **August 10, 2026** | All projects delivered to handoff. |
| **August 31, 2026** | One founder on call for fixes ends. Ownership transfers fully. |
| **After Aug 31** | Codebase + Claude continuity (see §9). |

**Implication for messaging:** Every offer page surfaces the cap, the last-start date, and the Aug 31 on-call window. Site copy was swept on 2026-04-25 to remove every "monthly retainer" / "ongoing support" implication.

---

## 8. Sales & Marketing Strategy

### 8.1 The named constraint
A Hormozi-style audit run on 2026-04-25 named the constraint as a **lead problem** — no booked discovery audits, no proven channel — with **pricing** as the secondary constraint. Pricing fixes shipped in Phases 1–3 of the audit. The lead problem requires founder-driven outreach and is not solvable through site work.

### 8.2 Acquisition channels (current vs. planned)

| Channel | Status | Funnel destination |
|---|---|---|
| Founder relationship outreach | **Live — pipeline building** | Trade pages or relationship pages by vertical, with `?ref=<source>` query param captured into Web3Forms |
| Paid Facebook / Google Local against trade keywords | Planned for cohort launch | `/hvac` · `/electricians` · `/plumbers` (trade-specific landing pages added 2026-04-26) → `/ai-receptionist` wedge ($497 entry, much easier yes than the $5,000 bundle). Wedge buyers convert upward via the $1,000-off-within-30-days credit toward Phase II (wedge decoupled from the bundle 2026-05-02 per Hormozi-style audit, so the two-step funnel works as intended: low-friction wedge yes → 30-day relationship → bundle upsell at $4,000). |
| Founder DMs to non-trades operators | Live | `/salons` · `/auto-shops` · `/restaurants` (relationship-channel pages, same offer, different framing) |
| Missed-call cost calculator | Live (added 2026-04-26) | `/missed-call-calculator` standalone + embedded on `/pricing`. Free four-question calculator that estimates revenue lost to voicemail; converts to wedge CTA. |
| Site-to-form contact | Live | `/contact` (Web3Forms backend) |
| Self-serve booking | Live (added 2026-04-30) | `/book` standalone + "Book a fit call" CTAs across the site: **primary** CTA on the Home hero (promoted from secondary on 2026-04-30; replaced the prior "Apply for a founding slot" Home CTA), per-tier sibling on Pricing, sibling to "Reserve a setup spot" on AIReceptionist + Trade pages, sibling to "Apply for a founding slot" on Relationship pages, and a secondary CTA in the global nav dropdown ("Apply for a Slot" remains primary there). Calendly event at `calendly.com/nashdavis-tsd-ventures/30min` (30 min, single-host on Nash's schedule today; round-robin across the three founders when Bishop + Grant onboard onto Calendly Teams). `utm_source=<source>` attribution rides on the Calendly URL — captured in booking emails, the Calendly admin source column, and webhook payloads. |
| On-site AI chat agent | Live (added 2026-04-25, hardened with Upstash distributed rate limit 2026-04-26) | Captures lead in chat → posts to Web3Forms tagged `[Chat agent]` |

### 8.3 The chat agent as eat-our-own-dog-food

A custom chat widget mounted globally on the site, backed by Claude Haiku 4.5 via a Vercel serverless function (`/api/agent`). Two payoffs: (1) a buyer who asks "can you actually build one of these?" can press the bubble and try it; (2) 24/7 sales surface that qualifies before asking for contact details. Cost: ~$24/month at 100 conversations/day. The agent is instructed to be honest that there are zero signed clients yet — "Summer 2026 is the first cohort, recruiting the founding ten now."

### 8.4 SEO posture

Every route ships as its own static `index.html` (via `vite-react-ssg`) with per-route `<title>`, meta description, canonical, OG/Twitter tags. JSON-LD `ProfessionalService` schema on the homepage powers Google's Knowledge Panel. Three indexable per-service URLs (`/services/ai-integration`, `/services/websites`, `/services/process-modernization`) replaced what was originally a single tabbed `/services` modal — one URL = one buyer intent. Trade-specific landing pages (`/hvac`, `/electricians`, `/plumbers`) and relationship-channel pages (`/salons`, `/auto-shops`, `/restaurants`) added 2026-04-26 for separate ad/DM funnels.

Local SEO: `geo` coordinates and `openingHoursSpecification` (Mon–Sun 08:00–20:00) in JSON-LD; visible NAP card on `/contact`; phone + hours in the global footer. Deferred: claimed Google Business Profile, directory listings (Yelp, BBB, Chamber), and `sameAs` links in the schema.

---

## 9. Customer Pipeline — Current State

As of **2026-04-25** there are four warm verbal leads via relationship outreach, no paid spend, **zero signed contracts**. Treat this as a strong pipeline, not closed business — Nash corrected the "locked" framing 2026-04-25 because nobody has signed yet.

| # | Lead | Vertical | Location | Status |
|---|---|---|---|---|
| 1 | Studio C Salon | Salon | Gastonia, NC | Strong interest |
| 2 | Moose Electric | Electrical / Trades | Lincolnton, NC | Strong interest |
| 3 | Diesel Doctors | Auto / Trades | Charlotte, NC | Strong interest |
| 4 | Cake Me Away Bakery | Food | Dallas, NC | Warm |

All four came in via founder relationship outreach (not the site). Only Moose Electric maps to the trades wedge the paid-traffic funnel was built around — the other three are salon, auto, bakery, which is why the relationship-channel pages (`/salons`, `/auto-shops`, `/restaurants`) exist as separate funnels. The trades wedge stays committed for cold traffic; the relationship pages handle the warm-network book.

Three of four are in Gaston / Lincoln County rather than Charlotte proper — service area still works, but the geo distribution informs where founder outreach is concentrated.

**External-facing rule (chat agent + voice receptionist + sales conversations):** until a contract signs, the honest answer to "who has hired you" is "no one yet — Summer 2026 is our first cohort."

The public `/testimonials` page is reframed as "The Ledger" — it ships the *methodology* of how case studies will be reported (Problem ▸ Build ▸ Outcome) before any case study exists, with three "Open slot" placeholder cards.

---

## 10. Post-Season Continuity (the differentiator after Aug 31)

The strongest post-handoff promise, surfaced on `/process`:

Every TSD build ships on **GitHub + Vercel** — both free for small business. Repo, deployment, and domain belong to the client from day one. During handoff, the client's **Claude account is linked to their GitHub repo**. To make a change, the client screenshots what they want (hours update, hero photo swap, copy edit) and sends it to Claude — Claude commits the fix, Vercel auto-deploys. The workflow is taught in the live training session and becomes muscle memory in a few cycles.

Promise: *"You're not on your own. One founder stays on call for fixes through August 31. Past that, your codebase has a co-pilot."*

---

## 11. Technology & Infrastructure

### 11.1 Site repo (`tsd-modernization`)

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Vite + React 18 | SPA build with `vite-react-ssg` for per-route static prerendering |
| Routing | `react-router-dom` v6 | Pinned to v6 (vite-react-ssg requirement) |
| Hosting / deploy | Vercel | Auto-deploys `main` branch; serverless functions in `/api/` |
| Form backend | Web3Forms | No server code; one access key. `?ref=<source>` query param captured into the form post for source attribution. |
| Booking | Calendly (vanilla widget script) | Event at `calendly.com/nashdavis-tsd-ventures/30min` (30 min, Nash-hosted today; round-robin path open via Calendly Teams). Widget script + CSS load once globally in `index.html`; inline embed on `/book` via `Calendly.initInlineWidget`, popup CTAs via `Calendly.initPopupWidget`. URL params set `primary_color=4B9CD3` to match `--c-accent`. |
| Chat agent | `@anthropic-ai/sdk` (Claude Haiku 4.5) | `/api/agent.js` Vercel serverless function with streaming, persistence, lead validation; ~$0.008/conversation |
| Chat agent rate limit | Upstash Redis (distributed) | Replaced in-memory rate limit on 2026-04-26 so multi-region Vercel instances share the bucket |
| Voice routing | Telnyx Call Control | TSD's published number `(704) 317-5630` is a Telnyx number; webhooks point at the voice-receptionist Fly app. Replaced Twilio on 2026-04-28 for cost + Frontline-discontinuation reasons. |
| Analytics | GA4 + Plausible + Microsoft Clarity | Env-gated; all three loaded conditionally on `VITE_*_ID` |
| Error monitoring | Sentry (`@sentry/react`) | Wired and live; 0.1 sample rate to stay in free tier |
| Build artifact | 19 prerendered routes + auto-generated `sitemap.xml` | `scripts/generate-sitemap.mjs` walks `dist/` post-build |

**Required env vars:** `VITE_WEB3FORMS_KEY`, `ANTHROPIC_API_KEY` (no `VITE_` prefix — server-side only).
**Optional:** `VITE_GA4_ID`, `VITE_PLAUSIBLE_ID`, `VITE_CLARITY_ID`, `VITE_SENTRY_DSN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

### 11.2 Sister repos (productized voice stack)

| Repo | Purpose | Stack |
|---|---|---|
| [`voice-receptionist`](https://github.com/nashyD/voice-receptionist) | Inbound AI receptionist (Austin) on Telnyx Call Control | FastAPI + Pipecat 1.0 + Deepgram STT + Anthropic LLM + ElevenLabs TTS, deployed on Fly.io. Same stack templates per-client for Phase II / wedge deployments. |
| [`tsd-dialer`](https://github.com/nashyD/tsd-dialer) | Outbound voice PWA so founders can place calls from the TSD number | Vite + React 19 + Tailwind v4 + `@telnyx/webrtc` PWA, two Vercel serverless functions for token issuance + recording webhook |

**Operating cost (visible from the repos):** GitHub + Vercel free tier; ~$24/month for the chat agent at 100 conversations/day; analytics tooling free at this volume; Sentry free tier; Telnyx voice usage ~$0.005/inbound minute (pocket change at TSD's volume). Marginal cost per closed deal is effectively zero — labor is the cost.

---

## 12. Financial Model — Back-of-Envelope

> *Note: the repo does not contain explicit revenue projections. The numbers below are computed from the published prices × stated cohort caps.*

### Revenue ceiling at full cohort

| Line | Unit price | Max units | Max revenue |
|---|---|---|---|
| Phase II Bundle (founding rate) | $5,000 | 10 | $50,000 |
| Founding Partnership (founding rate) | $10,000 | 3 | $30,000 |
| AI Receptionist setup (standalone) | $497 | 10 | $4,970 |
| Discovery audit (stepping-stone, on request) | $1,500 | rare — internal sales tool only | — |

**Notes on stacking:**
- Phase II is no longer bundled with the AI Receptionist as of 2026-05-02 (wedge decoupled per Hormozi-style audit). A buyer who wants both pays $497 + $5,000 = $5,497 standalone, OR $497 + $4,000 = $4,497 by sequencing wedge → Phase II within 30 days and using the $1,000 wedge-customer credit. The $1,000 credit is the cost of running the two-step funnel; the wedge's revenue function is restored as a low-friction first yes.
- Founding Partnership ($10,000) **includes** the discovery audit + Phase II Bundle in full + AI Receptionist setup + one additional system integration + custom AI re-training + monthly business review + named ops handholding. The bare-component absorption (audit + Phase II + wedge) is $1,500 + $5,000 + $497 = $6,997; the $10,000 Partnership price leaves a **$3,003 positive premium** for the integration, AI re-training, monthly review, and named ops support. Phase 4 of the Hormozi-style audit raised Founding Partnership from $5,000 to $10,000 on 2026-05-02 specifically to restore this positive premium — at the prior $5,000 price, the Partnership was structurally $1,997 cheaper than buying its components à la carte, which inverted the price-to-value relationship of the offer ladder.
- Standalone wedge revenue accrues fully when the wedge sells outside a Founding Partnership; if a wedge buyer subsequently uses the $1,000 credit toward Phase II, the wedge revenue ($497) still accrues, and Phase II accrues at $4,000 instead of $5,000.

### Realistic scenarios (assuming bundle-only or partnership-only buyers)

| Scenario | Bundles | Partnerships | Standalone audits | Standalone wedge | Revenue |
|---|---|---|---|---|---|
| Conservative (5 bundles, 0 partnerships) | 5 | 0 | 0 | 0 | $25,000 |
| Mid (8 bundles, 1 partnership, 2 audits) | 8 | 1 | 2 | 0 | $40,000 + $10,000 + $3,000 = **$53,000** |
| Full cohort (10 bundles, 3 partnerships) | 10 | 3 | 0 | 0 | $50,000 + $30,000 = **$80,000** |
| Full cohort + 5 standalone audits + 5 standalone wedge | 10 | 3 | 5 | 5 (one-time) | $80,000 + $7,500 + $2,485 = **$89,985** |

### Implied gross per founder
At full-cohort base ($80K / 3 founders): ~$26,667 per founder over the 14-week summer. At mid scenario ($53K / 3): ~$17,667 per founder. At conservative ($25K / 3): ~$8,333 per founder. The full-cohort number is up from $11,667 pre-Hormozi-audit ($35K base) and from $21,667 after the Phase 1-3 work alone — Phase 4 (Founding Partnership raise to $10K) accounts for the remaining $5,000 lift per founder at full cohort.

### Cost base
Materially zero infrastructure cost (~$30/month operating across the chat agent, voice-receptionist's Fly bill, and Telnyx usage at TSD's volume). The business is a labor partnership, not a venture vehicle. The standard anchors ($3,000 / $4,000 / $10,000) exist to make founding rates read as half-price, and to set the post-cohort price for any future season.

---

## 13. Risks & Mitigations

| Risk | Mitigation in place |
|---|---|
| **Lead problem** (no proven acquisition channel) | Founder-driven outreach is the primary motion. Paid ads against HVAC keywords planned for the wedge. Site is no longer the bottleneck. |
| **No social proof** (zero signed clients pre-launch publicly named) | The chat agent is instructed to acknowledge this directly. `/testimonials` ships methodology, not stock testimonials. Founding-cohort framing reframes the absence as scarcity. |
| **Time-bounded model creates trust risk** for late-summer signers | Every offer page surfaces the cap, the July 13 last-start, and the Aug 31 on-call cutoff. Site swept on 2026-04-25 to remove every "ongoing" implication. |
| **Vertical mismatch risk** (HVAC-only framing closing salons/bakeries) | Homepage broadened to multi-vertical 2026-04-25; wedge page stays HVAC-only (different funnel). |
| **Client stuck post-Aug 31** | GitHub + Vercel + Claude continuity workflow; live training session before handoff. |
| **AI agent abuse / cost spike** | Upstash Redis distributed rate limit shipped 2026-04-26 (replaced the in-memory bucket so multi-region Vercel instances share state). Sentry monitors errors. |
| **No GBP, no directory presence** | Identified in audit §8; on Nash's queue. |
| **Carrier-side voice infra (single-vendor risk)** | Mitigated 2026-04-28 by migrating off Twilio (which had discontinued Frontline and abandoned Flex Mobile, signaling SMB voice exit) onto Telnyx. Same code path supports both via Pipecat's serializers if a future migration becomes necessary. |
| **Phase II guarantee was generic** | Mitigated 2026-05-02 per Hormozi-style audit. Replaced "if we missed the mark by handoff" with two operationalizable triggers: 14-day delivery (25% refund if missed) + 3 qualified AI-captured leads in 30 days post-launch (AI-portion refund + rebuild free). Phase II's risk reversal now matches Phase I's "money-back if no $25K of opportunities" in operational specificity. See §6.2; verification mechanics in [`GUARANTEE_VERIFICATION.md`](GUARANTEE_VERIFICATION.md). |

---

## 14. Roadmap & Open Items

Refreshed from `PROJECT_LOG.md`. Items checked off were live-verified against the repo on 2026-04-29.

**Done since the original plan extraction:**
- ✅ `?ref=<source>` query-param capture wired into the contact form (Slice 5a, 2026-04-26).
- ✅ Chat agent rate limit upgraded to Upstash distributed (Slice 5b, 2026-04-26).
- ✅ Trade-specific landing pages (`/hvac`, `/electricians`, `/plumbers`) shipped (Slice 3a, 2026-04-26).
- ✅ Relationship-channel landing pages (`/salons`, `/auto-shops`, `/restaurants`) shipped (Slice 3b, 2026-04-26).
- ✅ Missed Call Calculator at `/missed-call-calculator` + embedded on `/pricing` (Slice 4, 2026-04-26).
- ✅ Pricing restructured to three tiers with Founding Partnership at $5,000 (2026-04-26).
- ✅ Twilio→Telnyx voice migration complete; published phone is `(704) 317-5630` (2026-04-28).
- ✅ AI integration page chatbot mockup replaced with animated demo (2026-04-28); demo enlargement pass (2026-04-29).
- ✅ Hero theme-aware fix so the cinematic frame follows the page bg in light mode (2026-04-29).
- ✅ Missed-call calculator inputs paired with range sliders for ballpark entry (2026-04-29).
- ✅ Calendly booking system live: `/book` route, sibling "Book a fit call" CTAs across all conversion pages, single-host Calendly event on Nash's schedule (round-robin across the three founders when Bishop + Grant onboard onto Calendly Teams) (2026-04-30; pivoted from Cal.com to Calendly mid-day).

**Still open:**

1. **Founder-driven outreach to fill the remaining founding-cohort spots** — still the named constraint per the Hormozi-style audit. Site work is no longer the bottleneck.
2. **Add testimonials + client logos to the homepage.** Biggest conversion lift per hour once the first cohort lands.
3. **Claim Google Business Profile + embed map on Contact.** Pending — directly impacts local-SEO surface.
4. **Banner PNG redesign** — `tsd_modernization_banner.png` and `tsd_ventures_banner.png` still on the legacy palette.
5. **Business-card print files** — re-export from the new 4-slab prism SVG masters before the next print run.
6. **Voice-receptionist productization for clients** — templating script (`make new-client`), Google Calendar integration, hours-aware routing, handoff packet. Outlined in §5.4 / §11.2 — needed before the first paying client takes delivery.
7. **Personal-line dual-persona Austin** — second Telnyx number (`+1 704 317 5534`) provisioned for the founder's personal line use case; persona-dispatch code in voice-receptionist still to ship.

---

## 15. Brand & Editorial System (for reference)

Codified in `src/shared.jsx` and applied across all pages:

- **Palette:** Carolina blue + cream + navy. Dark-mode default with light-mode toggle.
- **Typography:** Playfair Display italic for editorial accents · Inter for body.
- **Logo:** 4-slab prism, applied across favicon, OG image, and all `tsd-ms-logo*.svg` variants (unified 2026-04-25 — previously two parallel designs lived in the project).
- **System glyph:** Diamond (◆) — used as bullet, separator, masthead segment divider.
- **Section markers:** `◆ LABEL` / hairline rule / `§ 0N`. Founder/phase chips: `FOUNDER NO. 0X` and `PHASE I/II` follow the magazine-issue conceit.
- **Voice rules** (per the in-repo `humanizer` skill):
  - No "X, not Y" contrastive phrasing.
  - No imperative trio cadence.
  - No fabricated stats — every published number sourced or removable.

---

## 16. Source Files Referenced

| File | What it provided |
|---|---|
| `README.md` | Stack, conventions, pre-launch context, voice rules |
| `index.html` (JSON-LD) | Legal entity, founders, phone, area served, price range, hours |
| `src/pages/Home.jsx` | Hero copy, value prop, stats, founders strip, trades-strip wedge, "Why we do this" thesis |
| `src/pages/Pricing.jsx` | Three-tier offer (Phase I / II / Founding Partnership), founding-rate anchors, money-back guarantee, July 13 last-start, embedded missed-call calculator, FAQ |
| `src/pages/AIReceptionist.jsx` | Wedge product mechanics, pricing, risk-reversal terms, ownership-transfer note |
| `src/pages/Team.jsx` | Founder bios, roles, schools, "what I ship" lists, business-card details |
| `src/pages/Process.jsx` | 4-step engagement flow + post-Aug 31 Claude+GitHub continuity story |
| `src/pages/WhyUs.jsx` | Competitive comparison table |
| `src/pages/Contact.jsx` | NAP block, service area (FAQ migrated to /pricing 2026-04-26) |
| `src/pages/Testimonials.jsx` | Case-study methodology framework (pre-clients) |
| `src/pages/TradePage.jsx` (used by `/hvac`, `/electricians`, `/plumbers`) | Trade-specific landing pages, paid-traffic destinations |
| `src/pages/RelationshipPage.jsx` (used by `/salons`, `/auto-shops`, `/restaurants`) | Relationship-channel landing pages, founder-DM destinations |
| `src/pages/MissedCallCalculator.jsx` + `src/components/MissedCallCalculatorWidget.jsx` | Standalone calculator + reusable widget embedded on `/pricing`; paired number+slider inputs |
| `src/components/TSDAgent.jsx` + `api/agent.js` | Site-wide chat agent (Claude Haiku 4.5, streaming, Upstash rate limit) |
| `src/components/ChatbotDemo.jsx` + `MakeFlowDemo.jsx` | Animated demo embeds in the `/services/ai-integration` Solutions Gallery |
| `src/services-data.js` | Three service definitions, included items, timelines, prices |
| `PROJECT_LOG.md` | Hormozi-style audit, named constraint (lead problem), pre-launch leads, every operating decision through 2026-04-29 |
| Sister repo: [`voice-receptionist`](https://github.com/nashyD/voice-receptionist) | Inbound AI receptionist (Austin) — Telnyx + Pipecat + Deepgram + Anthropic, deployed on Fly |
| Sister repo: [`tsd-dialer`](https://github.com/nashyD/tsd-dialer) | Outbound founder dialer PWA — Telnyx WebRTC + Vercel functions |
