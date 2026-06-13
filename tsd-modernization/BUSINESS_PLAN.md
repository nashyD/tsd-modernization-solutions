# TSD Modernization Solutions — Business Plan

**2026-06-12 money-saver reframe (major):** The pitch now leads with dollars and hours saved — hero: *"We find the money your business is leaking — and build what stops it."* The audience wedge is unchanged (established, reputation-rich local businesses); the value claim sharpened from modernization to savings, backed by anonymized real numbers ($540/mo cut at a local bakery; a wholesale importer's site assistant running at $73/mo) and published conservative arithmetic. The Services page was rebuilt from three pillar buckets into **six named services, each with its own route**: TSD Front Desk (`/services/front-desk`), TSD Concierge (`/services/concierge`), TSD Booking Bridge (`/services/booking-bridge`), Custom Websites (`/services/websites`), **TSD Lead Engine** (`/services/lead-engine`, new), and the **TSD Cost-Cut Audit** (`/services/cost-cut-audit`, new — flat fee, guaranteed: free if it can't find its fee in annual savings). Old bucket slugs and `/ai-receptionist` 301 to the new routes (the standalone Front Desk page is folded into its service page). New surfaces: a **savings calculator at `/savings`** (four inputs, conservative assumptions printed, email-me-the-breakdown capture) and a **printable savings one-pager per service at `/sheets/<slug>`** for Grant and Bishop's iPad pitches. Reviews / Lead follow-up / Local SEO / workflow automations became an add-ons strip (still estimator line items). Estimator gained the Lead Engine row ($2,400–$3,400 placeholder) in lockstep with the app's `estimator.ts`. Build prerenders 25 routes (was 16). See PROJECT_LOG 2026-06-12. §§5–6, 8.2, 14 updated below; dated history preserved as-is. **Same-day follow-up — lineup focused to four sold SKUs** (Nash's call via the CEO consult): TSD Front Desk, TSD Concierge, TSD Lead Engine, custom websites. Booking Bridge cut as a SKU → booking-automation capability/add-on; Cost-Cut Audit pulled from the paid catalog → the free diagnostic inside every 30-minute fit call (page kept as the keyword surface). Lead Engine stays (Nash owns the funnel IP, set up as the intern). See §5 + PROJECT_LOG 2026-06-12 "focus to four."

**2026-05-22 repositioning (major):** TSD is now a permanent, year-round company — the summer-only/cohort framing is dropped (no operating window, no last-start date, no cohort caps, no "founding cohort," no Aug 31 cutoff, no "no retainers" promise). The Charlotte-trades wedge (HVAC/Electrical/Plumbing) is dropped in favor of a situational wedge — established, reputation-rich local businesses whose digital presence lags their reputation and whose owner has become the bottleneck. The fixed public price tiers (Discovery audit / Website + AI Build / Full Modernization / $497 wedge) are retired in favor of a company-size estimator on `/pricing` that returns a one-time build range plus an optional recurring Managed AI plan (cancel anytime); exact price comes from a free fit call + 48-hour written proposal. Products are renamed and expanded to seven, including TSD Front Desk (the former AI receptionist, now recurring), TSD Concierge, and TSD Booking Bridge. Trade landing pages (`/hvac`, `/electricians`, `/plumbers`) and `/missed-call-calculator` were retired (301-redirected, components deleted); `/salons`, `/auto-shops`, `/restaurants` were kept and re-wedged; the build now prerenders 16 routes (was 20). See PROJECT_LOG 2026-05-22. Dated history below is preserved as-is.*

*Extracted from [github.com/nashyD/tsd-modernization-solutions/tree/main/tsd-modernization](https://github.com/nashyD/tsd-modernization-solutions/tree/main/tsd-modernization) on 2026-04-26; refreshed against live source on 2026-05-24 (§9 customer pipeline replaced with the real Bisque / Studio C / Sonderwerks book, retiring the 2026-04-25 trades-era lead snapshot; §3 + §7 corrected so technical delivery sits with Nash while Grant and Bishop run sales + operations, fixing the prior three-founders-deliver-builds capacity overstatement; §14 open-item 10 closed); 2026-05-22 (full repositioning sync — §§1, 4–7, 8, 10, 12–14, 16 rewritten to the permanent-company / estimator / Managed-AI model, per the bold note above); 2026-05-19 (§11 reorganized — the sibling Next.js app `tsd-modernization-app/` now has its own subsection §11.2 covering the public `/audit` lead-magnet, the authenticated `/app` client portal, the `/admin` surface, and the server-rendered branded audit PDF; voice sister repos moved to §11.3 and corrected for the Quo/Vapi reality; operating cost to §11.4. Also: §1 names the audit lead-magnet + client portal; §2 schema priceRange corrected to $1500–$10000; §8.2 gained a free-presence-audit channel row and §8.4 a per-route-JSON-LD + `llms.txt` note; §11.1 route count corrected to 20; §12 cost base and §13 voice-carrier row de-staled; §14 roadmap refreshed through 2026-05-12 — see PROJECT_LOG 2026-05-06 through 2026-05-12); 2026-05-12 (phone-number migration: Vapi-managed numbers retired → Quo-issued numbers — company line now `+19808905815`, per-founder lines Nash `+19802176884`, Grant `+19802464961`, Bishop `+19802179777`; §2 Company Overview phone row and §11.1 Voice routing row updated; live code in `index.html`, `src/Layout.jsx`, `src/components/CallButton.jsx`, `src/pages/Contact.jsx`, `src/pages/Team.jsx`, `api/agent.js`, and `content/tsd-knowledge.md` already reflects the new numbers — PROJECT_LOG 2026-05-12 entry pending); 2026-05-06 (audit tool stood up at `tsd-modernization.com/audit` via path-based Vercel rewrites to a sibling Next.js app `tsd-modernization-app/` in the same repo — public `/audit` lead-magnet, authenticated `/app` portal, `/admin` surface, Supabase + Anthropic + Google Places + Resend stack; new §11.2 sister-repo row + §14 roadmap "Done" entry — see PROJECT_LOG 2026-05-06); 2026-05-05 (phone-number migration: Telnyx `+17043175630` → Vapi-managed `+19802279003` for the company line, plus per-founder Vapi-managed work lines for Nash/Grant/Bishop replacing the prior shared-line setup on the team page; the Vapi-managed move resolves the BYO-Telnyx SIP REFER incompatibility that was blocking transferCall on every personal line — see PROJECT_LOG 2026-05-05); 2026-05-04 (ELU session-replay analysis tag installed in `<head>` — new §11.1 row); 2026-05-03 (tier renaming pass: "Phase II Website + AI Bundle" → "Website + AI Build", "Founding Partnership" → "The Full Modernization", wedge offering on `/pricing` referenced as "After-Hours Lead Capture"; per-tier scarcity counters dropped, anchor strikethrough prices removed pending real anchor sales, Bishop's name pulled from Full Modernization deliverables in favor of "TSD partner" + weekly written status report, Full Modernization guarantee tightened from 8 leads / 60 days to 15 leads by Aug 31 — ROI calculator math has 3-30× headroom; prior 2026-05-02 refresh: Phase II raised to $5,000 / $10,000 anchor + two operationalizable Phase II guarantee triggers + wedge decoupled from bundle with $1,000-off-within-30-days credit + Founding Partnership raised to $10,000 / $20,000 anchor with new scope and outcome guarantee + Phase I discovery audit demoted to stepping-stone offer; prior changes: pricing restructure, vertical reframe, Twilio→Telnyx migration, route additions, Calendly booking funnel). Sourced from `README.md`, `index.html` (JSON-LD), all page components in `src/pages/`, `services-data.js`, and the `PROJECT_LOG.md` audit/changelog.*

---

## 1. Executive Summary

**TSD Modernization Solutions** is a permanent, year-round tech-modernization company run by three founders, building custom websites and AI for Charlotte-area small businesses. The wedge: established, reputation-rich local businesses whose digital presence lags their reputation and whose owner has become the bottleneck. The line that carries it — *"You earned the reputation; your tech should carry it"* — and the promise that the work doesn't wait on the owner. The audience is situational, not a trade list: salons & spas, specialty automotive, wholesale & supply, studios & makers, professional services, specialty retail.

Engagements mix to fit from four sold services: (1) a custom website (managed by us, or owned by you), (2) **TSD Front Desk** — an AI receptionist that answers phone and chat, qualifies, and books, (3) **TSD Concierge** — a site assistant / RAG over the client's own content and catalog with semantic and image search, and (4) **TSD Lead Engine** — a conversion funnel plus a lead dashboard. Add-ons ride along with a build: booking automation, reviews & reputation, lead follow-up & outreach, local SEO. Every free 30-minute fit call also includes a cost-cut audit (the free leak-finding diagnostic; not a paid product). (Lineup focused to these four on 2026-06-12 — Booking Bridge cut to a capability, the audit reframed into the fit call; see §5.)

Pricing has no fixed public tiers. A company-size estimator on `/pricing` returns a one-time build range plus an optional recurring **Managed AI** plan (priced by the number of AI products in use, cancel anytime); the exact figure comes from a free fit call and a 48-hour written proposal. Builds are priced to size and product mix — a basic site starts in the low thousands, while larger engagements (30+ employees) typically start near $25,000+. Each engagement runs the client's way — Managed (TSD hosts and maintains it, edits on request, from $49/mo for a site) or Owned (source code the client's from day one) — and carries a 100% money-back guarantee. (The estimator's exact dollar figures are still placeholders pending sign-off.)

The thesis: ~50,000 small businesses in the Charlotte metro, fewer than 30% with modern tools — a gap caused by agency pricing and the disappearance of dependable freelancers, not buyer reluctance.

Beyond the marketing site, a sibling Next.js app adds two software surfaces: a free automated **presence audit** at `/audit` that serves as the top-of-funnel lead magnet, and an authenticated **client portal** at `/app` where signed clients track their build. Both are detailed in §11.2.

Legal entity: **TSD Ventures, LLC**. "TSD Modernization Solutions" is one of two operating brands under the LLC (the other is TSD Mobile Detailing); neither is a separate legal entity. No d/b/a filed yet, so binding contracts are signed as TSD Ventures, LLC; marketing and chat copy use the brand name freely.

---

## 2. Company Overview

| | |
|---|---|
| **Legal entity** | TSD Ventures, LLC (NC) |
| **Operating brand** | TSD Modernization Solutions |
| **Website** | https://tsd-modernization.com |
| **Phone** | +1 (980) 890-5815 (Quo-issued since 2026-05-12). Founders also have individual TSD work lines on Quo: Nash `+1 (980) 217-6884`, Grant `+1 (980) 246-4961`, Bishop `+1 (980) 217-9777`. Prior history: (980) 227-9003 was Vapi-managed 2026-05-05 → 2026-05-12 (replacing Telnyx (704) 317-5630 because Vapi's BYO-Telnyx integration silently force-injected SIP REFER on transferCall, which Telnyx rejected during outbound dial — see PROJECT_LOG 2026-05-05); (704) 317-5630 was Telnyx-owned starting 2026-04-28, replacing the brief (704) 741-1746 Twilio line, which itself replaced the (704) 275-1410 GV line on 2026-04-27. |
| **Hours** | Every day, 8am – 8pm |
| **Service area** | Charlotte, Gastonia, Belmont (NC) — service-area business, no storefront |
| **Operating model** | Permanent, year-round — no operating window, no last-start date, no cohort cap |

Schema.org type on the live site: `ProfessionalService` with `priceRange` `$5000 – $25000`.

---

## 3. Founders & Roles

All three founders attend different UNC-system schools but grew up within twenty minutes of each other in the Carolina piedmont. Promise to clients: "When you hire TSD, you hire these three people — no account managers, no offshoring, no handoffs."

Inside that promise the work splits cleanly by function: Nash leads all technical scoping, build, and delivery; Grant drives sales, pricing, and intake; Bishop runs operations, proposals, and client onboarding. Because every build runs through Nash, build capacity is a function of his hours — see §7.

| # | Name | Role | School | Email | Owns |
|---|---|---|---|---|---|
| 01 | **Nash Davis** | CEO & Head of Modernization | UNC Chapel Hill | nashdavis@tsd-ventures.com | Custom AI chatbots & integrations · Site architecture & build · Solution scoping and delivery |
| 02 | **Bishop Switzer** | COO — Operations | UNC Wilmington | bishopswitzer@tsd-ventures.com | Project tracking & timelines · Proposals & invoicing · Handoff documentation & training |
| 03 | **Grant Tadlock** | CFO & Sales Lead | UNC Charlotte | granttadlock@tsd-ventures.com | Financial planning & pricing · Sales pipeline & intake · Client relationships |

Founder pull-quotes (positioning):
- Nash: *"When it breaks, you call me — not a ticket queue."*
- Bishop: *"Every proposal is documented. Every handoff is yours to keep."*
- Grant: *"A fixed price and a money-back guarantee — no surprises."*

---

## 4. Market & Opportunity

**TAM (Charlotte metro):** ~50,000 small businesses. Fewer than 30% have modern tools — the stated thesis is that this gap is access (agency pricing + freelancer disappearance), not reluctance.

**Wedge positioning (re-cut 2026-05-22 — situational, not a trade list):**

The wedge is a situation, not an industry: an established, reputation-rich local business whose digital presence lags its reputation and whose owner has become the bottleneck — every booking, question, and follow-up routes through one overloaded person. The framing energy across the site: *"Websites and AI for businesses people already trust, built so the work doesn't wait on you,"* and *"You earned the reputation; your tech should carry it."*

- **Homepage / general wedge:** the bottleneck-relief message above, illustrated by situational examples rather than a single vertical — salons & spas, specialty automotive, wholesale & supply, studios & makers, professional services, specialty retail. The earlier Charlotte-trades strip (HVAC · Electrical · Plumbing) was dropped on 2026-05-22.
- **Vertical landing pages (kept, re-wedged):** `/salons`, `/auto-shops`, `/restaurants` — the three vertical pages were kept and re-pointed at the situational story (same offer, vertical-specific framing) rather than a trades-vs-relationship channel split. The retired trade pages (`/hvac`, `/electricians`, `/plumbers`) 301-redirect to `/ai-receptionist` or `/pricing`.
- **TSD Front Desk page (`/ai-receptionist`):** the AI receptionist, no longer committed to any single vertical — it is one of seven products that mix to fit the bottleneck the owner actually has.

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

**Lineup focused to four sold SKUs on 2026-06-12** (Nash's call, via the CEO consult logged that day): Booking Bridge cut as a SKU and folded into website/Front Desk builds as a capability (estimator add-on `booking`, relabeled "Booking automation"); the Cost-Cut Audit pulled from the paid catalog and reframed as the free diagnostic inside the 30-minute fit call. Four named services remain, each with its own route and prerendered page (`/services` + `src/services-data.js`), plus an add-ons strip (Booking automation, Reviews & reputation, Lead follow-up, Local SEO, workflow automations — selectable estimator line items). Every service page opens with a **"What this saves you"** money table (`savesRows`), an anonymized proof line, and links to the `/savings` calculator and its `/sheets/<slug>` one-pager. Old slugs 301: `ai-integration` → `front-desk`, `process-modernization` + `booking-bridge` → `websites`, `/ai-receptionist` → `front-desk`.

### 5.1 TSD Front Desk (`/services/front-desk`)
AI receptionist on the client's existing phone line + website chat — answers 24/7, qualifies the caller, books a real calendar slot, texts the owner a summary. Built on the client's real intake and voice; it answers TSD's own company line today. Saves-pitch: replaces $1,500–2,500/mo of front-desk coverage and the after-hours bookings currently lost. **How it works:** forward → answer/book in real time → SMS confirmations both ways. **Model:** setup from ~$1,200 + optional Managed AI from $73/mo. **Risk reversal:** free if it books nothing in the first 30 days. Page keeps the vs-national-SaaS comparison table. Timeline: about a week.

### 5.2 TSD Concierge (`/services/concierge`)
Site assistant trained on the client's own content + catalog (RAG, semantic + image search), cited answers, lead capture. Saves-pitch: the hours staff burn repeating answers; proof: running for a Charlotte wholesale importer at $73/mo. Timeline: 1–3 weeks.

### 5.3 TSD Lead Engine (`/services/lead-engine`)
Conversion-built landing funnel + a lead dashboard the client's team actually works from (statuses, notes, ownership, automated follow-up, spam protection, outcome analytics; multilingual when the market needs it). Saves-pitch: stops referrals and ad clicks dying in an unread inbox. Proof: live for a Carolina insurance agency (IP owned by TSD per Nash, who set it up as the intern). Timeline: 2–3 weeks.

### 5.4 Custom Websites (`/services/websites`)
Custom React/Vite site — mobile-first, on-page SEO + AI-search visibility, analytics wiring, AI-chat integration, written + video handoff docs. Saves-pitch: the agency retainer — Managed from $49/mo, or Owned outright from day one. Timeline: 2–4 weeks.

### 5.5 Booking automation (capability, not a SKU — folded 2026-06-12)
One booking front door + calendar sync + confirmations/reminders + lead routing, on the tools the client already pays for. Cuts phone tag, double-bookings, and no-shows. Was the standalone "TSD Booking Bridge" SKU; now a capability line on the website + Front Desk pages and a selectable add-on (`booking`, $1,300–1,900) in the estimator. In-flight Booking-Bridge work (e.g. the Gastonia salon) continues — the cut is to featuring/selling it as its own product, not to honoring committed builds.

### 5.6 Cost-Cut Audit — the fit-call diagnostic (`/services/cost-cut-audit`, reframed 2026-06-12)
A line-by-line teardown of the client's software, subscription, and vendor bills: overlap map, kill list with dollar amounts, switch plan. **No longer a paid SKU — it's the free diagnostic run inside the 30-minute fit call**, and the kill list is the prospect's to keep whether or not they hire TSD. Proof: $540/mo found at a local bakery (website vendor + domain middleman). It's the "find the leak" funnel entry that opens the money-saver conversation; the page is kept (off the SKU grid via `gridHidden`) as the keyword surface and is surfaced on `/book`, `/savings`, and the home funnel. Timeline: runs live on the call, full kill list within a couple of days.

### 5.7 Savings surfaces
- **`/savings` calculator** — four inputs (missed calls/wk, average ticket, software spend, owner admin hours), conservative published assumptions (win 1 in 4 missed calls, 25% of software spend cuttable, owner time $35/hr), live monthly + annual leak, email-me-the-breakdown capture (Web3Forms), analytics events per input + CTA. Successor to the retired missed-call calculator; its 301 repointed here.
- **`/sheets/<slug>` one-pagers** — a printable, ink-light Letter sheet per service generated from the same `services-data.js` (math table, proof line, guarantee, phone + `/savings` URL), built for Grant and Bishop's in-person pitches. `noindex`.

---

## 6. Pricing & Packaging

No fixed public tiers. `/pricing` leads with a **company-size estimator** ([`src/components/PricingEstimator.jsx`](src/components/PricingEstimator.jsx)): the prospect picks their team size, which products they want running, and **how it should run — Managed or Owned (step added 2026-06-12)** — and gets a realistic **one-time build range** plus the matching **monthly** figure. The exact, fixed price comes from a free fit call + a 48-hour written proposal.

> **The dollar figures in the estimator are placeholders pending Nash's sign-off.** Tune them in the `SIZES` / `PRODUCTS` / `MANAGED` config at the top of `PricingEstimator.jsx`.

### How the estimate is built
- **Size multiplier:** Just me (1–2) ×0.8 · Small team (3–10) ×1.0 · Established (11–30) ×1.3 · Larger (30+) ×2.7. The "Larger" tier renders as a "custom build — typically from $X+" floor (≈ $25,000+ with the full product mix) rather than a bounded range.
- **Products in the estimator (one-time setup range, before the size multiplier):** Custom website $2,900–$4,000 · TSD Front Desk $1,200–$1,600 · TSD Concierge $4,100–$5,800 · TSD Lead Engine $2,400–$3,400 — the four sold services, kept in dollar-lockstep with `tsd-modernization-app/src/lib/sales/estimator.ts` (pinned by its test). **The add-ons (booking automation, reviews & reputation, lead follow-up, local SEO, workflow automations) were removed from the estimator picker + the Pricing legend on 2026-06-12** so the pricing page shows only the four services; they're still real work, now scoped and quoted on the fit call rather than self-served. Only Front Desk and Concierge are AI products, so Managed AI through the estimator reaches at most 2 tiers ($147/mo); the per-product MANAGED rule ($73–$373 for 1–5) is unchanged and forward-compatible if an AI add-on returns.
- **The cost-cut audit is free, not an estimator line:** it's the diagnostic run inside the 30-minute fit call (reframed from a flat-fee SKU on 2026-06-12). The kill list is the prospect's to keep regardless.
- **Managed AI (recurring, optional, cancel-anytime):** priced by the number of AI products running — $73 / $147 / $222 / $297 / $373 per month for 1–5 AI products. A website-only build needs no monthly plan.
- **Ownership multiplier (added 2026-06-12):** Managed = base setup price + the monthly. **Owned = setup × 1.25 with nothing recurring** — the handoff package (source code, credentials, runbook, docs, live training) and the forgone recurring revenue priced into the one-time fee. The multiplier is a placeholder pending Nash's sign-off, defined once as `OWNED_MULT` in both `PricingEstimator.jsx` and the app's `estimator.ts` (pinned by `estimator.test.ts`; `depositFromSelection` carries the ownership choice so Square deposits track the owned price).

### What every engagement carries
- Source code, credentials, and runbook the client's from day one.
- 100% money-back guarantee — *"You sign the scope. We deliver. If we missed the mark by handoff, every dollar comes back inside a week."*
- 48-hour written proposal; one fixed price (no hourly).
- Managed AI is the only recurring charge, and it is always optional.

### Legacy ladder (retired 2026-05-22)
The prior public ladder — $1,500 Discovery audit, $5,000 Website + AI Build, $10,000 Full Modernization, and the $497 one-time "After-Hours Lead Capture" wedge with its $1,000 cross-sell credit and per-tier guarantees — was retired in the repositioning. The Front Desk's one-time-purchase / "no subscription forever" framing was replaced by the recurring Managed AI model. The standalone paid audit survives only as an optional scope-and-recommend stepping stone surfaced in qualifying conversations (see [`AUDIT_OFFER_PLAYBOOK.md`](AUDIT_OFFER_PLAYBOOK.md)). Operational guarantee mechanics still live in [`GUARANTEE_VERIFICATION.md`](GUARANTEE_VERIFICATION.md).

---

## 7. Operating Model

TSD runs as a **permanent, year-round company** — no operating window, no cohort cap, no last-start date. This reverses the original summer-only / 14-week-cohort model; that framing and its May 7 – Aug 10 timeline were retired on 2026-05-22.

**Two revenue motions.**
1. **Custom builds** — one-time, fixed-price engagements (websites + AI products), scoped per client and quoted after a fit call.
2. **Managed AI** — the recurring monthly relationship that keeps the AI products tuned and current after launch. This is the structural shift that makes the business ongoing rather than a string of one-offs: it turns each build into a relationship and gives the company recurring revenue.

**Capacity.** Technical delivery runs through Nash — scoping, build, and handoff — while Grant and Bishop drive sales and operations alongside. A build runs 2–4 weeks (larger, multi-system engagements scoped individually), so the binding constraint is Nash's available build hours. TSD therefore takes a handful of builds at a time and surfaces that honestly on the site as a real capacity limit — never manufactured scarcity. Build throughput scales only by adding builders, which is the explicit trigger to revisit this section.

**Managed or owned — never a lock-in.** The client chooses: TSD hosts and maintains it (Managed — website from $49/mo, AI from $73/mo, cancel anytime) or takes full ownership at handoff (source code, credentials, runbook). The relationship continues because the service stays valuable — clients stay by choice.

---

## 8. Sales & Marketing Strategy

### 8.1 The named constraint
A Hormozi-style audit run on 2026-04-25 named the constraint as a **lead problem** — no booked discovery audits, no proven channel — with **pricing** as the secondary constraint. Pricing fixes shipped in Phases 1–3 of the audit. The lead problem requires founder-driven outreach and is not solvable through site work.

### 8.2 Acquisition channels (current vs. planned)

| Channel | Status | Funnel destination |
|---|---|---|
| Founder relationship outreach | **Live — primary motion** | Vertical pages (`/salons`, `/auto-shops`, `/restaurants`) or the relevant product page, with `?ref=<source>` captured into Web3Forms |
| Vertical landing pages | Live | `/salons` · `/auto-shops` · `/restaurants` — re-wedged 2026-05-22 to the situational story; same offer, vertical-specific framing |
| Free presence audit (lead magnet) | Live (added 2026-05-08) | `/audit` — a free automated AI presence audit run by the sibling `tsd-modernization-app` Next.js app, fronted on `tsd-modernization.com/audit`. Prospect enters business name, URL, email, and phone; gets back a presence score, gap list, and a recommended TSD package, and TSD captures the lead. Surfaced from the nav dropdown, a tertiary Home-hero link, and the footer. See §11.2. |
| Pricing estimator | Live (added 2026-05-22) | `/pricing` — company-size estimator returns a build range + a Managed AI figure, then routes to "Book a fit call" / "Get a written proposal." |
| Savings calculator (lead magnet) | Live (added 2026-06-12) | `/savings` — four-input leak calculator with conservative published assumptions; secondary hero CTA on Home ("See what you're losing"), CTAs in The Math section and every service page. Captures email via "email me this breakdown" (Web3Forms); fires `savings_calc_*` analytics events per input and CTA. |
| Savings sheets (sales collateral) | Live (added 2026-06-12) | `/sheets/<slug>` — printable per-service one-pagers generated from `services-data.js`, for Grant and Bishop's in-person/iPad pitches; linked from each service page. The "what it saves you per month" sheet the 2026-06-11 daily brief called for. |
| Site-to-form contact | Live | `/contact` (Web3Forms backend) |
| Self-serve booking | Live (added 2026-04-30) | `/book` standalone + "Book a fit call" CTAs across the site (Home hero primary, plus siblings on Pricing, the product pages, and the nav dropdown). Calendly event at `calendly.com/nashdavis-tsd-ventures/30min` (30 min, Nash-hosted today; round-robin across the three founders when Bishop + Grant onboard onto Calendly Teams). `utm_source=<source>` attribution rides on the Calendly URL. |
| On-site AI chat agent | Live (added 2026-04-25, hardened with Upstash distributed rate limit 2026-04-26) | Captures lead in chat → posts to Web3Forms tagged `[Chat agent]` |

### 8.3 The chat agent as eat-our-own-dog-food

A custom chat widget mounted globally on the site, backed by Claude Haiku 4.5 via a Vercel serverless function (`/api/agent`). Two payoffs: (1) a buyer who asks "can you actually build one of these?" can press the bubble and try it; (2) 24/7 sales surface that qualifies before asking for contact details. Cost: ~$24/month at 100 conversations/day. The agent is instructed to be honest that the company is early and to focus on whether TSD is a fit, rather than name-dropping clients.

### 8.4 SEO posture

Every route ships as its own static `index.html` (via `vite-react-ssg`) with per-route `<title>`, meta description, canonical, OG/Twitter tags. JSON-LD `ProfessionalService` schema on the homepage powers Google's Knowledge Panel; as of 2026-05-08 each route also emits page-scoped JSON-LD via `src/route-jsonld.js` — `Service`/`Offer` on the service and vertical pages, `FAQPage` + `OfferCatalog` on `/pricing`, `HowTo` on `/process`, an `ItemList` of `Person` on `/team`, `ContactPage` on `/contact` (across the kept routes) — each referencing the business by `@id` so org-level fields aren't duplicated. A `public/llms.txt` summary ships alongside `robots.txt` as an AI-crawler-readable description of the offer. Three indexable per-service URLs (`/services/ai-integration`, `/services/websites`, `/services/process-modernization`) replaced what was originally a single tabbed `/services` modal — one URL = one buyer intent. The vertical landing pages (`/salons`, `/auto-shops`, `/restaurants`) are kept; the former trade pages (`/hvac`, `/electricians`, `/plumbers`) and `/missed-call-calculator` were retired 2026-05-22 with 301 redirects.

Local SEO: `geo` coordinates and `openingHoursSpecification` (Mon–Sun 08:00–20:00) in JSON-LD; visible NAP card on `/contact`; phone + hours in the global footer. Deferred: claimed Google Business Profile, directory listings (Yelp, BBB, Chamber), and `sameAs` links in the schema.

---

## 9. Customer Pipeline — Current State

As of **2026-05-24**, TSD's real book is three established-specialist engagements, all sourced through founder relationship outreach. They are the strongest evidence for the repositioned wedge: each is a reputation-rich specialist whose digital presence lagged its reputation.

| # | Client | What they are | Location | Engagement | Status |
|---|---|---|---|---|---|
| 1 | **Bisque Imports** | B2B wholesale ceramics supplier (~$4.2M, ~32 employees, est. 1999; CEO DJ Toal) | Belmont, NC | Two embedded AI assistants for bisqueimports.com — a Resources Assistant (RAG over DJ's video transcripts + technique sheets) and a Products Assistant (semantic + image catalog search) | Active — scoped with Bisque's IT team; flagship engagement |
| 2 | **Studio C Spa & Salon** | Salon / spa (owner Crystal Irby + five independent practitioners) | Gastonia, NC | Consolidate a scattered web presence (multiple Squarespace sites + Vagaro) onto one site with a unified booking front door; provider migrations to Square Appointments; Google Business Profile setup | Active — site built and design done; awaiting client content (bios, photos, prices) to launch |
| 3 | **Sonderwerks Porsche** | Porsche service / restoration / performance specialist (15,000 sq ft; founder Dave Van Epps) | Cornelius, NC | Full Next.js site redesign (7 pages) built on spec as the pitch | Prospect — spec redesign delivered; pursuing the engagement |

All three came through founder relationship outreach, not the site, and all three are established specialists — which is the case for sharpening the wedge toward "established specialist whose tech lags their reputation" (see §4). Bisque is the prototype: a finished, demoable engagement here is worth more than any volume of fresh pipeline, because it becomes the case study that wins the next specialist. TSD's lane on Bisque is the modernization layer (the two AI assistants), not a bisqueimports.com rebuild or NetSuite/SuiteScript work.

**External-facing rule (chat agent + voice receptionist + sales conversations):** name a client publicly only once the work has shipped and the client has cleared it. Bisque came through a family-friend relationship (DJ Toal) — handle that reference with extra care. Until a build is live and approved for use, the honest line is "we're early, and our first engagements are in build now."

The public `/testimonials` page is reframed as "The Ledger" — it ships the *methodology* of how case studies will be reported (Problem ▸ Build ▸ Outcome) before any case study is public, with "Open slot" placeholder cards that convert to real case studies as Bisque and Studio C ship.

---

## 10. Ownership & Continuity

The strongest post-handoff promise, surfaced on `/process`:

Every TSD build ships on **GitHub + Vercel** — both free for small business — with the domain registered in the client's name. The client chooses how it runs. **Managed** is the default: TSD hosts it, keeps it current, and makes every change on request — the client texts what they want (hours update, hero photo swap, a fresh quote) and it's live, usually same day, with no code or vendor login to touch (website from $49/mo, AI from $73/mo, cancel anytime). **Owned** is for teams who'd rather hold the keys: repo, deployment, and domain are theirs from day one, and during handoff the client's **Claude account is linked to their GitHub repo** so a screenshot sent to Claude commits the fix and Vercel auto-deploys — taught in a live training session.

Promise: *"Run it your way — let us manage it end to end, or own the build outright (source code, credentials, and a Claude co-pilot). Either way it's yours, never a lock-in."*

---

## 11. Technology & Infrastructure

### 11.1 Marketing site (`tsd-modernization`)

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Vite + React 18 | SPA build with `vite-react-ssg` for per-route static prerendering |
| Routing | `react-router-dom` v6 | Pinned to v6 (vite-react-ssg requirement) |
| Hosting / deploy | Vercel | Auto-deploys `main` branch; serverless functions in `/api/` |
| Form backend | Web3Forms | No server code; one access key. `?ref=<source>` query param captured into the form post for source attribution. |
| Booking | Calendly (vanilla widget script) | Event at `calendly.com/nashdavis-tsd-ventures/30min` (30 min, Nash-hosted today; round-robin path open via Calendly Teams). Widget script + CSS load once globally in `index.html`; inline embed on `/book` via `Calendly.initInlineWidget`, popup CTAs via `Calendly.initPopupWidget`. URL params set `primary_color=4B9CD3` to match `--c-accent`. |
| Chat agent | `@anthropic-ai/sdk` (Claude Haiku 4.5) | `/api/agent.js` Vercel serverless function with streaming, persistence, lead validation; ~$0.008/conversation |
| Chat agent rate limit | Upstash Redis (distributed) | Replaced in-memory rate limit on 2026-04-26 so multi-region Vercel instances share the bucket |
| Voice routing | Quo PSTN (company line SIP-trunked into Vapi for the receptionist; founder lines direct) | TSD's published company number is `+1 (980) 890-5815` (Quo-issued since 2026-05-12), SIP-trunked into the Vapi `tsd` assistant in the `tsd-receptionist` repo. Founders' TSD work lines are direct Quo cell numbers (no Vapi in path): Nash `+19802176884`, Grant `+19802464961`, Bishop `+19802179777` — chosen for SMS support and normal outbound-dial behavior, which Vapi-managed numbers don't provide. Prior numbers were Vapi-managed from 2026-05-05 to 2026-05-12 (`+19802279003` company + `+19802274913` / `+19802274917` / `+19802274702` founders) and bound to per-founder Vapi assistants in the `tsd-receptionist` repo. The earlier voice-receptionist Fly app (Pipecat-on-Fly) was decommissioned when the Telnyx number it relied on was migrated; the Telnyx account is retained for SBO client deploys where the buyer-owns-the-number handoff story matters. See PROJECT_LOG 2026-05-12 for the migration rationale. |
| Analytics | GA4 + Plausible + Microsoft Clarity | Env-gated; all three loaded conditionally on `VITE_*_ID` |
| Error monitoring | Sentry (`@sentry/react`) | Wired and live; 0.1 sample rate to stay in free tier |
| User-behavior analysis | ELU (`elu.dev`) | AI session-replay analysis layered on existing analytics. Site-wide async tag in `<head>` with hardcoded publishable key (`pk_live_*` format, safe in client source). Auto-discovers user flows, surfaces behavioral insights, generates code-fix PR suggestions. Installed 2026-05-04 pre-launch so post-launch traffic accrues data from day one. |
| Per-route structured data | Global `ProfessionalService` JSON-LD in `index.html` + page-scoped JSON-LD via `src/route-jsonld.js` | Service/Offer/FAQPage/HowTo/ItemList/ContactPage nodes baked into the static HTML at build time (added 2026-05-08; trade + missed-call nodes removed 2026-05-22) |
| Build artifact | 16 prerendered routes + auto-generated `sitemap.xml` + `public/llms.txt` | `scripts/generate-sitemap.mjs` walks `dist/` post-build |

**Required env vars:** `VITE_WEB3FORMS_KEY`, `ANTHROPIC_API_KEY` (no `VITE_` prefix — server-side only).
**Optional:** `VITE_GA4_ID`, `VITE_PLAUSIBLE_ID`, `VITE_CLARITY_ID`, `VITE_SENTRY_DSN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

### 11.2 The audit + client-portal app (`tsd-modernization-app`)

A second app, `tsd-modernization-app/`, lives as a sibling subdirectory in the same GitHub repo and deploys as its own Vercel project (`tsd-modernization-solutions-uc71.vercel.app`). The marketing site's `vercel.json` path-rewrites `/audit`, `/app`, `/admin`, `/login`, `/auth/*`, `/api/audit/*`, and `/_next/*` onto it, so all three surfaces below appear to the visitor as part of `tsd-modernization.com`. The two Vercel projects build independently — the marketing project's Root Directory is `tsd-modernization/`, so it never sees this subdir.

**Public — the `/audit` lead magnet.** A prospect submits business name, URL, email, and phone. A server action rate-limits the request (3/day per IP, 2/day per email), writes a `leads` row and a pending `audits` row, and starts the pipeline: the prospect's site is scraped with `cheerio` (meta tags, viewport, schema, OG, CTAs, link/image counts, sitemap) in parallel with a Google Places (New API) lookup for Google Business Profile signals, then Claude (`claude-sonnet-4-6`, a forced `submit_audit` tool call for strict-schema output) synthesizes a presence score, five pillar scores, a gap list, a recommended TSD package, and a short markdown report. The result is stored in Supabase, the prospect is emailed a link via Resend, and the report page polls until ready (~40s end to end). The report offers a **Download PDF** — a server-rendered, TSD-branded, two-page Letter document built as HTML/CSS and rendered by headless Chromium (`puppeteer-core` + `@sparticuz/chromium-min`).

**Authenticated — the `/app` client portal.** Signed clients sign in by magic link and see their build: `/app/package` (their tier and inclusions), `/app/progress` (a work-item kanban — todo / doing / done), `/app/deployment` (the latest Vercel deployment for their project, read via the Vercel REST API), `/app/voice` (a Vapi browser test-call widget against their assistant), and `/app/snapshot` (their latest monthly presence audit with a delta against the prior month). Each module degrades gracefully when its integration ID is unset.

**Internal — the `/admin` surface.** TSD-only, role-gated. `/admin/clients` lists and creates clients; `/admin/clients/[id]` edits client info and integration IDs, invites and removes client owners by magic link, and runs full work-item CRUD. A "view as client" control sets an eight-hour httpOnly cookie so any founder can render a client's portal exactly as that client sees it (behind a warning banner); a delete-client action cascades the client's owners and work-items.

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 · `lucide-react` icons |
| Database / Auth | Supabase Postgres + Supabase Auth (passwordless magic link). Five tables — `clients`, `client_users`, `leads`, `audits`, `work_items` — all under row-level security; writes go through the service-role key. |
| AI | Anthropic Claude `claude-sonnet-4-6` (env `ANTHROPIC_MODEL`), forced-tool-call audit synthesis, prompt caching on the system prompt |
| External APIs | Google Places API (New) for GBP signals · `cheerio` site scraping · Resend transactional email · Upstash Redis rate limiting · `@vapi-ai/web` for the in-portal voice test |
| Audit PDF | `puppeteer-core` + `@sparticuz/chromium-min` — server-rendered, branded, two-page document |
| Hosting | Own Vercel project; daily cron at 13:00 UTC; a separate Railway worker (Fastify + Playwright) handles the Phase-4 monthly snapshot diffing |

The portal's magic-link auth and row-level security are verified end to end; the monthly-snapshot worker and the owner-invite email flow are code-complete but not yet exercised against a real signed client.

### 11.3 Sister repos — voice stack

| Repo | Purpose | Status |
|---|---|---|
| `tsd-receptionist` | Current AI-receptionist infrastructure — Vapi assistants (a company `tsd` assistant plus per-founder assistants) with system prompts versioned in the repo. The Quo company line is SIP-trunked into the `tsd` assistant (see §11.1). | Active — current voice infra |
| [`voice-receptionist`](https://github.com/nashyD/voice-receptionist) | The earlier inbound AI receptionist (Austin) — FastAPI + Pipecat 1.0 + Deepgram STT + Anthropic LLM + ElevenLabs TTS on Fly.io. | Decommissioned when its Telnyx number was migrated; the Telnyx account is retained for client deploys where a buyer-owns-the-number handoff matters |
| [`tsd-dialer`](https://github.com/nashyD/tsd-dialer) | Outbound founder-dialer PWA — Vite + React 19 + `@telnyx/webrtc`, with Vercel serverless functions for token issuance + recording webhook. | Deprecated / no longer maintained (2026-05-05) |

### 11.4 Operating cost

GitHub + Vercel free tier across both Vercel projects; ~$24/month for the chat agent at 100 conversations/day; Supabase, Resend, Upstash, the analytics stack, and Sentry all free at pre-launch volume; voice usage (the Quo line plus Vapi assistant minutes) is a few dollars a month at TSD's volume. The audit PDF's Chromium binary adds a ~3–4s cold start on first invoke, with no recurring cost. Marginal cost per closed deal is effectively zero — labor is the cost.

---

## 12. Financial Model — Back-of-Envelope

> *Note: the repo contains no explicit revenue projections, and as of the 2026-05-22 repositioning the estimator's dollar figures are still placeholders. The numbers below are illustrative, not forecasts. Two revenue streams replace the old fixed-tier / cohort math.*

### 1. One-time custom builds
Variable by product mix and company size (see §6 — one-time product ranges × size multiplier). Illustrative one-time totals from the current placeholder estimator:

| Engagement | Illustrative one-time |
|---|---|
| Small team (3–10) — website + TSD Front Desk | ≈ $4,200–$8,500 |
| Established (11–30) — website + Front Desk + Concierge + booking automation | ≈ $13,000–$28,000 |
| Larger (30+) — full product mix | custom, **from ≈ $25,000+** |

There is no cohort cap, so build revenue scales with how many engagements three founders can deliver (2–4 weeks each; see §7 capacity).

### 2. Recurring Managed AI (MRR)
The structural change. Each AI product a client keeps live adds to a monthly base — $73 / $147 / $222 / $297 / $373 for 1–5 AI products, optional and cancel-anytime. MRR compounds across clients:

| Book of clients | Avg / client | Approx MRR | Approx ARR |
|---|---|---|---|
| 10 clients | ~$200/mo | ~$2,000 | ~$24,000 |
| 25 clients | ~$200/mo | ~$5,000 | ~$60,000 |

— **on top of** one-time build revenue. This is the line that turns TSD from a string of projects into an ongoing business, and is the single biggest financial difference from the retired summer-cohort model.

### Cost base
Materially zero fixed infrastructure cost — on the order of $30/month, almost all of it the chat agent, with Vercel, Supabase, Resend, Upstash, and the analytics tooling all in free tiers and voice usage a few dollars a month (see §11.4). Managed AI carries a small per-client recurring cost (model inference + re-indexing) that stays well under its monthly price. The business is a labor partnership; labor is the real cost. *(All build and Managed-AI figures above depend on the still-placeholder estimator numbers — finalize before using in proposals or projections.)*

---

## 13. Risks & Mitigations

| Risk | Mitigation in place |
|---|---|
| **Lead problem** (no proven acquisition channel) | Founder-driven outreach is the primary motion. Paid ads against HVAC keywords planned for the wedge. Site is no longer the bottleneck. |
| **No social proof** (no publicly named clients yet) | The chat agent acknowledges the company is early. `/testimonials` ships case-study methodology rather than stock quotes; real case studies replace it as builds land. |
| **Managed AI churn / recurring-revenue risk** | Managed AI is optional and cancel-anytime, so MRR must be earned every month. Mitigation: the recurring work is real (re-indexing, model upkeep, monitoring, a monthly report), and ownership-from-day-one means clients stay for value, not lock-in. |
| **Wedge legibility** (a situational wedge is harder to ad-target than a trade) | The 2026-05-22 wedge is a situation ("the owner is the bottleneck"), not a keyword. Mitigation: TSD's motion is warm referral + relationship outreach, where a story that lands in conversation beats one that lands in ad targeting; the vertical pages give concrete entry points. |
| **Client stuck after handoff** | GitHub + Vercel + Claude continuity workflow; live training session before handoff; optional Managed AI for ongoing care. |
| **AI agent abuse / cost spike** | Upstash Redis distributed rate limit shipped 2026-04-26 (replaced the in-memory bucket so multi-region Vercel instances share state). Sentry monitors errors. |
| **No GBP, no directory presence** | Identified in audit §8; on Nash's queue. |
| **Carrier-side voice infra (vendor lock / continuity)** | The published phone path has been re-pointed three times (Twilio → Telnyx → Vapi-managed → Quo) as vendor fit changed, each migration proving the surfaces can move without a code rewrite. Current posture splits the risk: the company line is a Quo PSTN number SIP-trunked into a Vapi assistant, founder lines are direct Quo cell numbers, and the Telnyx account is retained for client deploys where a buyer-owns-the-number handoff matters. See §11.1 / §11.3. |
| **Estimator prices are placeholders** | The `/pricing` estimator is live with un-signed-off numbers (framed on-page as an estimate; exact price comes from a fit call). Mitigation: the numbers live in one config block (`PricingEstimator.jsx`) — finalize before relying on them in proposals. |

---

## 14. Roadmap & Open Items

Refreshed from `PROJECT_LOG.md`, current through the 2026-05-22 changelog entry.

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
- ✅ Per-founder TSD work lines provisioned and bound to Vapi assistants — Nash `+19802274913`, Grant `+19802274917`, Bishop `+19802274702`, plus the company line on `+19802279003` (2026-05-05). Replaces the prior "dual-persona Austin on a single Telnyx number" plan with cleaner per-founder switchboard assistants in `tsd-receptionist`. See PROJECT_LOG 2026-05-05 for the full migration story.
- ✅ **Audit lead-magnet live at `tsd-modernization.com/audit`** (2026-05-06). Sibling Next.js app `tsd-modernization-app/` in this repo handles a public form → website scrape + Google Places lookup + Anthropic Claude (tool-use forcing) synthesis → Supabase store → Resend email → polling report page rendering presence score, gap list, recommended TSD package. Deployed as its own Vercel project; surfaced on the marketing domain via nine path-based rewrites added to this site's `vercel.json` (BEFORE the SPA catch-all). End-to-end pipeline ~40s. See PROJECT_LOG 2026-05-06.
- ✅ Per-route JSON-LD via `src/route-jsonld.js` + `public/llms.txt` for AI crawlers (2026-05-08; PROJECT_LOG 2026-05-08).
- ✅ Free `/audit` presence audit surfaced across the marketing site — nav dropdown, tertiary Home-hero link, footer (2026-05-08).
- ✅ Client-portal link added to the nav dropdown; `/app` portal magic-link auth + row-level security verified end to end (2026-05-08).
- ✅ Home hero rebuilt — text-first headline over a framed, theme-aware Charlotte timelapse (2026-05-08).
- ✅ Audit report **Download PDF** — server-rendered, TSD-branded, two-page document via headless Chromium (`puppeteer-core` + `@sparticuz/chromium-min`) (2026-05-09).
- ✅ `/admin` surface built out — client + owner management, work-item CRUD, "view as client" impersonation, Vercel-deployment view (≈2026-05-10).
- ✅ Carrier migration to Quo — company line `(980) 890-5815` SIP-trunked into Vapi, founders moved to direct Quo cell lines (2026-05-12; PROJECT_LOG 2026-05-12).
- ✅ **Major repositioning** (2026-05-22; PROJECT_LOG 2026-05-22): de-seasonalized to a permanent company; dropped the trades wedge for the situational "owner is the bottleneck" wedge; replaced fixed tiers with the company-size estimator + recurring Managed AI; renamed/expanded products (TSD Front Desk / Concierge / Booking Bridge + Reviews / Lead follow-up / Local SEO); retired `/hvac` `/electricians` `/plumbers` `/missed-call-calculator` (301s, components deleted); recast the Services page into three pillars; updated SEO meta, JSON-LD, `llms.txt`, sitemap, and the chatbot knowledge.
- ✅ **Lineup focused to four sold SKUs** (2026-06-12, same-day follow-up; PROJECT_LOG 2026-06-12 "focus to four"): Front Desk, Concierge, Lead Engine, websites. Booking Bridge cut to a capability/add-on; Cost-Cut Audit reframed as the free fit-call diagnostic (page kept off the grid). Estimator `booking` relabeled "Booking automation"; 301s for `/services/booking-bridge` + `/sheets/booking-bridge` → `/services/websites`; ROUTE_META / JSON-LD / `llms.txt` / `index.html` / `tsd-knowledge.md` / voice prompts all synced to four.
- ✅ **Money-saver reframe + six-service catalog** (2026-06-12; PROJECT_LOG 2026-06-12): hero and homepage rebuilt around "we find the money your business is leaking" with the $540/mo bakery stat and a new "The Math" section; Services page recast from three pillars into six named services with per-service routes and savings-first detail pages (closing the April audit's per-intent-route item); TSD Lead Engine and TSD Cost-Cut Audit productized from the gallantrenters and Cake Me Away engagements; `/savings` leak calculator and `/sheets/<slug>` printable one-pagers shipped; `/ai-receptionist` folded into `/services/front-desk`; SEO meta, JSON-LD, `llms.txt`, sitemap, and the chatbot knowledge updated (including the stale $97 Managed-AI floor in `tsd-knowledge.md` → $73 and the honest-framing section refreshed to the live anonymized client book).

**Still open:**

1. **Founder-driven outreach to land the first signed clients** — still the named constraint. Site work is no longer the bottleneck.
2. **Add testimonials + client logos to the homepage.** Biggest conversion lift per hour once the first cohort lands.
3. **Claim Google Business Profile + embed map on Contact.** Pending — directly impacts the local-SEO surface, and now self-evident: the `/audit` tool run against `tsd-modernization.com` itself flagged TSD's own GBP as broken (matched to an unrelated "Tsr Inc" listing).
4. **Banner PNG redesign** — `tsd_modernization_banner.png` and `tsd_ventures_banner.png` still on the legacy palette.
5. **Business-card print files** — re-export from the 4-slab prism SVG masters, with the founders' new Quo numbers, before the next print run.
6. **Per-client AI-receptionist productization** — a repeatable way to stand up a client's receptionist on the current Vapi stack (`tsd-receptionist`): assistant templating, calendar integration, hours-aware routing, handoff packet. Outlined in §5.4 / §11.3 — needed before the first wedge or Full-Modernization client takes delivery.
7. **Exercise the `/app` portal against a real signed client** — magic-link auth and row-level security are verified, but the owner-invite email flow and the Phase-4 monthly-snapshot worker are code-complete and untested against real client data. The first signed client is the integration test.
8. ~~**Personal-line dual-persona Austin** — second Telnyx number provisioned for the founder's personal-line use case; persona-dispatch code still to ship.~~ **Superseded** 2026-05-05 by per-founder assistants (`tsd-personal`, `grant-personal`, `bishop-personal` in `tsd-receptionist`), then by the 2026-05-12 move of all founder lines to direct Quo cell numbers. The dual-persona-on-one-number approach is no longer needed.
9. **Finalize estimator pricing** — the `/pricing` estimator dollar figures (size multipliers, per-product ranges, `OWNED_MULT` 1.25, the Lead Engine $2,400–$3,400 row) are all placeholders pending Nash's sign-off.
10. ~~**Refresh §9 customer pipeline**~~ — **Done 2026-05-24.** §9 now lists the real book (Bisque / Studio C / Sonderwerks); the 2026-04-25 trades-era lead snapshot was retired.

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
| `src/pages/Home.jsx` | Hero copy, value prop, stats, founders strip, "who we build for" segment strip, "Why we do this" thesis |
| `src/pages/Pricing.jsx` | Company-size estimator (via `PricingEstimator.jsx`), product legend, money-back guarantee, FAQ |
| `src/pages/AIReceptionist.jsx` | TSD Front Desk page — recurring AI receptionist (custom setup + Managed AI), how-it-works, SaaS-vs-custom comparison, ownership |
| `src/pages/Team.jsx` | Founder bios, roles, schools, "what I ship" lists, business-card details |
| `src/pages/Process.jsx` | 4-step engagement flow + post-launch Claude+GitHub ownership/continuity story |
| `src/pages/WhyUs.jsx` | Competitive comparison table |
| `src/pages/Contact.jsx` | NAP block, service area (FAQ migrated to /pricing 2026-04-26) |
| `src/pages/Testimonials.jsx` | Case-study methodology framework (pre-clients) |
| `src/pages/RelationshipPage.jsx` (used by `/salons`, `/auto-shops`, `/restaurants`) | Vertical landing pages, founder-outreach destinations |
| `src/components/PricingEstimator.jsx` | Company-size pricing estimator embedded on `/pricing` — size + product picker → one-time range + Managed AI |
| `src/components/TSDAgent.jsx` + `api/agent.js` | Site-wide chat agent (Claude Haiku 4.5, streaming, Upstash rate limit) |
| `src/components/ChatbotDemo.jsx` + `MakeFlowDemo.jsx` | Animated demo embeds in the `/services/ai-integration` Solutions Gallery |
| `src/services-data.js` | Three service pillars (Custom Websites / AI / Automation & Growth) spanning seven products, included items, timelines, prices |
| `vercel.json` | Path-based rewrites that front the `tsd-modernization-app` audit / portal / admin surfaces onto `tsd-modernization.com` |
| `src/route-jsonld.js` + `public/llms.txt` | Per-route structured data and the AI-crawler offer summary |
| `PROJECT_LOG.md` | Hormozi-style audit, named constraint (lead problem), pre-launch leads, every operating decision through 2026-05-12 |
| Sibling app: `tsd-modernization-app/` | `/audit` lead-magnet, `/app` client portal, `/admin` surface — see §11.2 |
| Sister repo: `tsd-receptionist` | Current AI-receptionist infrastructure — Vapi assistants + versioned system prompts (see §11.3) |
| Sister repo: [`voice-receptionist`](https://github.com/nashyD/voice-receptionist) | Earlier inbound AI receptionist (Austin) — Telnyx + Pipecat + Deepgram + Anthropic on Fly; now decommissioned |
| Sister repo: [`tsd-dialer`](https://github.com/nashyD/tsd-dialer) | Outbound founder dialer PWA — Telnyx WebRTC + Vercel functions; deprecated |
