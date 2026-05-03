# Guarantee Verification — Internal Operating Doc

Internal-use only. Not deployed. Lives at repo root alongside `BUSINESS_PLAN.md` and `PROJECT_LOG.md`.

This doc explains how the founders verify whether a guarantee trigger has fired on either tier, and what happens next. The customer-facing contract language for the Build (formerly "Phase II") lives in `contracts/phase-ii-guarantee-terms-2026-05-02.md` and (after Bishop's paste) in the signed `agreement-of-work-template.docx`. The Full Modernization (formerly "Founding Partnership") outcome guarantee is captured in §6 of `BUSINESS_PLAN.md` and surfaced on the public `/pricing` card; contract paste-ready clauses are pending.

---

## Tier name reference

The tier names changed on 2026-05-03 (Set C plain-English rename pass — see `PROJECT_LOG.md`). Old / new mapping:

| Was | Is |
|---|---|
| Phase II Bundle / Phase II | Website + AI Build (or "the Build") |
| Founding Partnership | The Full Modernization (or "the Full Modernization") |
| AI Receptionist setup (on `/pricing`) | After-Hours Lead Capture (the wedge product page is still `/ai-receptionist`) |

Old-name references in this doc and in the contracts directory are preserved where they refer to the tier *as it existed at the time of the contract being adopted* — the legal file `contracts/phase-ii-guarantee-terms-2026-05-02.md` keeps its filename and internal "Phase II" language for traceability of what was signed when.

---

## The two Build (formerly Phase II) triggers

| # | Trigger | What it costs us if fired |
|---|---|---|
| 1 | Site not live within 14 days of contract signature (with content/creds in hand) | $1,250 refund (25% of $5,000) within 7 days |
| 2 | Fewer than 3 qualified AI-captured leads in 30 days post-launch | Refund the AI portion (case-by-case dollar amount) + rebuild the AI integration free |

---

## Build Trigger 1 — Delivery Speed

**Clock starts** on the date BOTH:
1. Both parties have signed the Agreement of Work
2. TSD has received the three onboarding items: (a) brand assets, (b) integration credentials, (c) initial copy / homepage content brief

**Pause rule.** If the three onboarding items aren't all in TSD's hands within 7 days of signature, the 14-day clock pauses until they are. Re-starts the day after.

**What "live" means.** Site is published to its production domain (`yourbusiness.com` or whatever the contracted domain is — not the Vercel preview URL), with all contracted pages reachable, the AI integration active, and the contact form working.

**Bishop's job.** Track the kickoff date and the live-by date in the project tracker (Linear / Notion / wherever cohort projects are tracked). Set a calendar reminder for day 13 — if there's any chance of slipping, flag it 24 hours before the deadline so we can either (a) sprint to ship, (b) pause the clock if pause conditions are met, or (c) trigger the refund proactively without waiting for the client to ask.

**Refund mechanics.** $1,250 back to the original payment method within 7 days of the missed deadline. The contract says automatic — no client-side ask required. Bishop initiates from the founder Stripe account / wherever the original payment was processed. Log the refund in `PROJECT_LOG.md` under that client's project entry.

---

## Build Trigger 2 — AI Outcome (3 qualified leads in 30 days post-launch)

### Qualified-lead definition (operating version)

A qualified lead, for this guarantee, is any inbound contact captured by the AI integration with all three of:

1. **Name** — first name minimum, last name not required
2. **Service request** — a stated business need (e.g. "need an AC unit installed," "looking for someone to do a wedding cake," "need a lawyer for an estate question"). Generic curiosity ("just looking around") doesn't count.
3. **Contact info** — phone number OR email address. One is enough; both is fine.

**Edge cases:**
- Same person triggering the AI three times in 30 days = 1 qualified lead, not 3.
- Spam or test calls (TSD founders calling to verify the AI is working, the client testing the system, obvious bot traffic) don't count.
- A lead that's missing one of the three components but is clearly real (e.g. "Hey it's John, my AC stopped working" with no callback number provided) doesn't count for guarantee math but should still be flagged to the client as a near-miss.
- "Reasonable doubt resolved in client's favor" per the contract — if it's borderline, count it.

### How to verify the count

Three sources, in order of authority:

1. **Voice-receptionist call log export.** The Pipecat / Telnyx pipeline writes every call to a per-client log with full transcript, captured fields, and timestamp. For voice-deployed clients, this is the canonical source.
2. **Chat-agent transcript export.** For chat-deployed clients, the chat-agent's persistence layer (currently the Anthropic conversation logs + the Web3Forms submissions tagged `[Chat agent]`) is the source.
3. **Client-side spot check.** Ask the client whether the leads in (1) or (2) actually showed up in their phone / inbox. If the client says they got fewer leads than the export shows, the export is the source of truth — the client may have missed notifications.

The export should be sent to the client on request, regardless of whether the trigger is being invoked. Transparency builds trust; gating the data behind a refund request makes us look defensive.

### Refund mechanics (case-by-case dollar amount)

The contract intentionally doesn't fix the AI-portion refund amount because the AI scope varies between Builds (some are chatbot-only, some are receptionist + chatbot, some include workflow automation). The good-faith framework:

- **AI receptionist + chatbot deployment:** refund ~$1,500-2,000 of the $5,000 Build, by Nash's read of how much of the build was AI vs. site
- **Chatbot or workflow only (no receptionist):** refund ~$800-1,200
- **Light AI integration baked into the site (single chatbot widget, no automation):** refund ~$500-800

These are the founder's first-pass benchmarks, not contractual numbers. Adjust per client. The principle: refund what feels honest given the actual delivered scope, then rebuild the AI integration free with the lessons learned.

**Rebuild scope.** "Rebuild the AI integration" means: (a) audit what didn't work over the 30 days, (b) redesign the prompt / call flow / capture fields based on findings, (c) redeploy. Not a full re-engagement — just the AI portion. Client keeps the existing site and the existing AI build until the rebuild is live (no downtime).

**Client must invoke in writing within 14 days post-window.** If they don't, the trigger expires. Track the 30-day post-launch end date + 14-day grace window in the project tracker; surface a reminder to the founders ~3 days before the grace window closes so we can proactively check in with the client about lead counts.

---

## The Full Modernization (formerly Founding Partnership) outcome guarantee

**Trigger.** Fewer than 15 qualified leads in the client's pipeline before August 31, 2026.

**What it costs us if fired.** $5,000 refund (50% of the $10,000 Full Modernization fee) + rebuild the AI integration free.

**Stacks with the Build's Trigger 1 and Trigger 2** above — Full Modernization clients get the same 14-day-or-25%-back delivery guarantee and the same 3-leads-in-30-days early outcome guarantee, because the Full Modernization includes the Build in full plus premium adds.

### Qualified-lead definition

Same definition as Build Trigger 2 (name + service request + contact info), with one addition: leads that come in through the operational integration (e.g. ServiceTitan booked appointments, QuickBooks-tracked customer touches, Jobber leads) also count, since the integration is part of what the Full Modernization is selling. The client's existing inbound lead flow during the engagement window does *not* count — only leads attributable to the AI integration or the operational integration TSD set up.

### Window

The window starts on the day the Build portion goes live (matches Trigger 2's "post-launch" framing) and ends August 31, 2026. For a contract signed in early May, that's ~16 weeks of capture window. For a contract signed in late June (right before the July 13 last-start cutoff), that's ~7 weeks — flag this to the prospect during sales: the closer the start date is to August 31, the less likely we are to clear the 15-lead bar, so the guarantee math gets tighter.

### Headroom on the 15-lead bar

ROI calculator math (`~/Downloads/roi-template.xlsx`, mid scenario, default Config multipliers) shows captured leads in the 7-16 week window run roughly:

| Contractor size | Avg calls/day | Captured leads / window |
|---|---|---|
| Very small | 5 | ~30-65 |
| Small-mid | 10 | ~60-130 |
| Mid | 25 | ~150-330 |

The 15-lead bar clears with several multiples of headroom across realistic Charlotte HVAC contractor sizing. Two failure modes to watch: (1) very-late-summer signups (compressed window), and (2) clients with low call volume (under 5 calls/day) where the math gets close — flag both during qualification.

### Refund mechanics

$5,000 back to the original payment method within 7 days of the missed deadline (i.e. by September 7, 2026 at the latest, since the trigger fires on Aug 31). Client doesn't have to ask. Bishop initiates from the founder Stripe account.

### Rebuild scope

Same as Build Trigger 2 — audit what didn't work, redesign the AI prompt / call flow / capture fields and the operational integration as relevant, redeploy. No downtime. The free rebuild is in addition to the 50% refund.

---

## When this doc gets updated

- After every guarantee invocation: append a short post-mortem at the bottom (date, client, which trigger, what we learned, what we changed).
- After every Build or Full Modernization contract revision: re-sync this doc against the contract clauses.
- After paste-ready Full Modernization contract clauses are drafted: link them in the cross-references below (parallel to the Build clauses in `contracts/phase-ii-guarantee-terms-2026-05-02.md`).

---

## Cross-references

- Build contract clauses (customer-facing): `contracts/phase-ii-guarantee-terms-2026-05-02.md` (filename retained for historical traceability — this is the version of the Build guarantee adopted on 2026-05-02 under the then-name "Phase II")
- Full Modernization contract clauses (customer-facing): pending paste-ready drafting
- Plan section: `BUSINESS_PLAN.md` §6 (Build + Full Modernization risk reversal under their respective tier subsections), §13 (risk: weak guarantee — closed)
- Decision entries: `PROJECT_LOG.md` 2026-05-02 entry on the Build (then-Phase-II) guarantee rewrite + 2026-05-03 entry on the Set C tier rename and Full Modernization guarantee tightening (8 leads / 60 days → 15 leads by Aug 31)
