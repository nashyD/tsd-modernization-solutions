import { C } from "./shared";
import {
  WebsiteIcon, BotIcon, PhoneIcon,
  BoltIcon, ChartBarIcon, CalendarIcon,
  LayoutIcon, SearchIcon, ChatBubbleIcon, ClipboardIcon,
} from "./icons";

/* ── The service catalog ────────────────────────────────────────────
   Six named services, each with its own route under /services/:slug.
   Money-saver reframe (2026-06-12): every service leads with what it
   saves — `saves` is the one-liner on the /services cards, `savesRows`
   is the math table on the detail page AND the /sheets/:slug one-pager,
   `proof` is the anonymized real-client line. Dollar examples stay
   conservative and are repeated nowhere else, so there is exactly one
   place to correct a number.

   Optional per-service sections the detail template renders when
   present: `steps` (how it works), `comparison` (vs. table),
   `riskReversal` (guarantee box). */

export const SERVICES = [
  {
    slug: "front-desk",
    Icon: PhoneIcon,
    title: "TSD Front Desk",
    desc: "An AI receptionist on your existing phone line and website chat. It answers at lunch, at 7pm, and on Sunday — qualifies the caller and books a real slot on your calendar.",
    longDesc: "Built on your real intake and voice: it knows your services, your hours, and what counts as urgent. You get an SMS summary of every call; the caller gets a confirmation text. Live in about a week.",
    tags: ["Phone + chat", "Books your calendar", "SMS summaries", "Managed or Owned"],
    gradient: C.gradientPrism,
    saves: "Saves a $1,500–2,500/mo front-desk hire and the after-hours bookings you lose now.",
    savesRows: [
      { label: "Part-time front-desk coverage", value: "$1,500–2,500 /mo" },
      { label: "Five missed calls a week at a $250 ticket", value: "≈ $1,350 /mo lost" },
      { label: "TSD Front Desk, managed", value: "from $73 /mo" },
    ],
    savesNote: "Assumes you would win 1 in 4 of the calls you currently miss. Run your own numbers on the savings calculator.",
    proof: "It answers TSD's own company line today — call (980) 890-5815 after hours and you'll meet it.",
    sheetLine: "Pays for itself the first month it saves one missed booking.",
    steps: [
      { num: "01", title: "Forward", body: "After-hours calls forward to a dedicated AI line. Set a time window — nights only, weekends only, always-on. Your call." },
      { num: "02", title: "Answer", body: "AI answers in your business voice, captures name, service, urgency, and address. Books an appointment slot from your calendar in real time." },
      { num: "03", title: "Confirm", body: "You get an SMS with the booking and a one-paragraph call summary. Caller gets a confirmation text. You call back when ready." },
    ],
    riskReversal: "If it doesn't book a single appointment in your first 30 days, every dollar comes back.",
    comparison: {
      theirsLabel: "National SaaS",
      theirsNote: "Smith.ai · NextPhone · Marlie",
      rows: [
        { axis: "Build", theirs: "Generic, self-serve", ours: "Custom-built on your real intake + voice" },
        { axis: "Pricing", theirs: "Locked monthly contracts", ours: "Fair setup + $73/mo, cancel anytime" },
        { axis: "Ownership", theirs: "Theirs — you rent the whole thing", ours: "Your call — we manage it, or you own the source code" },
        { axis: "Support", theirs: "Ticket queue, anywhere", ours: "Charlotte team that picks up the phone" },
      ],
    },
    included: [
      "Custom AI agent trained on your services, hours, and pricing",
      "Branded greeting and voice",
      "Calendar integration (Google or Apple)",
      "SMS confirmations to caller and to you",
      "Weekly summary of what got booked",
      "Ongoing tuning, monitoring, and model updates (Managed AI)",
      "Yours to own (source code + credentials) — or we manage it for you",
    ],
    timeline: "Live in about a week.",
    price: "Custom setup from $1,200, scoped on your fit call. Then optional Managed AI from $73/mo keeps it tuned, monitored, and answering — cancel anytime. Prefer to run it in-house? Source code, credentials, and the call log are yours from day one.",
    pairsWith: ["booking-bridge", "websites"],
    videos: [
      { title: "TSD Front Desk Walkthrough", desc: "See the AI receptionist answer a call, qualify the lead, and book the job." },
      { title: "Managed vs. Owned", desc: "The two ways to run it — we host and tune it, or you take the keys with full docs and training." },
    ],
    gallery: [
      { Icon: CalendarIcon, title: "Books From Your Calendar", desc: "Captures name, service, and urgency, then books a real slot in real time." },
      { Icon: ChatBubbleIcon, title: "Answers in Your Voice", desc: "Trained on your greeting, your services, and what counts as urgent at your shop." },
      { Icon: ChartBarIcon, title: "Monthly Insight Report", desc: "Managed AI keeps the agent current and reports what got captured and booked each month." },
    ],
  },
  {
    slug: "concierge",
    Icon: BotIcon,
    title: "TSD Concierge",
    desc: "A site assistant trained on your own catalog, documents, and policies. Visitors ask in plain English; it answers with your real products and pages, 24/7.",
    longDesc: "Semantic and image search across products, docs, and videos — so the question your staff answers ten times a day gets answered on the site, with the source linked.",
    tags: ["Trained on your catalog", "Cited answers", "RAG search", "24/7"],
    gradient: C.gradientAccent,
    saves: "Saves the hours your staff burns repeating answers — live for one importer at $73/mo.",
    savesRows: [
      { label: "An hour a day of staff answering the same questions", value: "≈ $430 /mo" },
      { label: "Product questions at 9pm with nobody to answer", value: "walked-away sales" },
      { label: "TSD Concierge, managed", value: "$73 /mo" },
    ],
    savesNote: "Staff time at $20/hr. Your numbers will differ — the savings calculator takes sixty seconds.",
    proof: "Running today for a Charlotte wholesale importer: it answers catalog, stock, and policy questions around the clock for $73 a month.",
    sheetLine: "Answers all day for less than what one staff hour costs.",
    included: [
      "Custom-trained on your content, catalog, and policies",
      "Semantic + image search across products, docs, and videos",
      "Cited answers that link your real pages",
      "Lead capture when the visitor wants a human",
      "Monthly report of what got asked and answered",
    ],
    timeline: "1-3 weeks from kickoff to launch.",
    price: "Scoped to your catalog and quoted as a fixed price after a free fit call — get a realistic range from the /pricing estimator. Managed AI from $73/mo keeps it current as your content changes; or own the build outright with docs and training.",
    pairsWith: ["websites", "front-desk"],
    videos: [
      { title: "TSD Concierge in Action", desc: "Watch the site assistant answer visitor questions from a real content + product catalog." },
    ],
    gallery: [
      { Icon: BotIcon, embed: "chatbot-demo", title: "TSD Concierge — Site Assistant", desc: "Branded AI assistant embedded on a client's site, answering questions and capturing leads 24/7." },
      { Icon: SearchIcon, title: "Semantic + Image Search", desc: "Finds the right product from a plain-English question or an uploaded photo." },
      { Icon: ChartBarIcon, title: "Monthly Insight Report", desc: "What visitors asked, what it answered, and the leads it captured." },
    ],
  },
  {
    slug: "booking-bridge",
    Icon: CalendarIcon,
    title: "TSD Booking Bridge",
    desc: "One booking front door wired to the calendar you already use — with confirmations, reminders, and lead routing automated behind it.",
    longDesc: "Instagram DMs, the website form, walk-in calls: all of it lands in one calendar, with the busywork automated on the tools you already pay for.",
    tags: ["One front door", "Reminders", "No-show defense", "Make / Zapier"],
    gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)",
    saves: "Saves the phone tag, the double-bookings, and the no-shows they cause.",
    savesRows: [
      { label: "Two no-shows a month at a $120 ticket", value: "≈ $240 /mo" },
      { label: "Three hours a week of scheduling phone tag", value: "≈ $455 /mo" },
      { label: "TSD Booking Bridge", value: "one fixed-price build" },
    ],
    savesNote: "Owner time at $35/hr. Automated reminders cut no-shows by a third or more in most service businesses.",
    proof: "Being built right now for a Gastonia salon that books by DM, text, and walk-in.",
    sheetLine: "One saved no-show a month is the whole pitch.",
    included: [
      "One booking front door on your site and socials",
      "Calendar sync with what you already run (Google, Apple, your booking system)",
      "Automated confirmations and reminders",
      "Lead routing and follow-up automations",
      "Built on the tools you already pay for",
    ],
    timeline: "Most bridges ship within 1-3 weeks.",
    price: "Scoped to the size of the workflow and quoted as a fixed price after a free fit call — estimate on the /pricing calculator. 100% money-back guarantee.",
    pairsWith: ["front-desk", "websites"],
    videos: [
      { title: "Booking Bridge Walkthrough", desc: "See scattered booking consolidated into one front door, synced to your calendar." },
    ],
    gallery: [
      { Icon: BoltIcon, embed: "make-flow-demo", title: "Automation Flow", desc: "Multi-step automation connecting a contact form to CRM, reminders, and calendar booking." },
      { Icon: CalendarIcon, title: "Consolidated Booking", desc: "One booking front door wired to the system you already use, with calendar sync and lead routing." },
      { Icon: ChatBubbleIcon, title: "Reminders That Land", desc: "Confirmation and reminder texts that cut no-shows without you lifting a finger." },
    ],
  },
  {
    slug: "websites",
    Icon: WebsiteIcon,
    title: "Custom Websites",
    desc: "A fast, modern site that finally matches your reputation — built to convert, and run your way. The storefront the AI works behind.",
    longDesc: "We build on modern frameworks (React, Vite) so the site is fast, accessible, and easy to maintain. Then you choose how it runs: Managed — we host it, keep it current, and make your changes (just text us) — or Owned, where the source code, credentials, and a runbook are yours from day one.",
    tags: ["Managed or Owned", "React", "SEO", "Mobile-First", "Analytics"],
    gradient: C.gradientAccent,
    saves: "Saves the agency retainer — Managed from $49/mo, or own it outright from day one.",
    savesRows: [
      { label: "Site platform + plugins + the person who edits it", value: "$150–400 /mo typical" },
      { label: "TSD Managed Website — hosting + edits by text", value: "from $49 /mo" },
      { label: "Or Owned outright", value: "$0 /mo" },
    ],
    savesNote: "One client's old site vendor alone billed more than $300 a month. We cut it as part of a $540/mo teardown.",
    proof: "Every site we ship runs the same stack as this one — fast, prerendered, analytics wired from day one.",
    sheetLine: "From $49/mo managed — a fraction of the retainer it replaces.",
    included: [
      "Custom-designed, mobile-first website",
      "On-page SEO + metadata tuned for search and AI visibility",
      "Google Analytics + Search Console wiring",
      "Contact form + AI chat integration",
      "Managed: hosting, upkeep, and changes on request — just text us, from $49/mo",
      "Owned: source code, credentials + runbook yours from day one, with docs and live training",
    ],
    timeline: "2-4 weeks from approved mockup to launch.",
    price: "Custom, fixed-price builds scoped to your pages, content, and the systems you already run. Build an estimate on the /pricing calculator; the exact price comes from a free fit call.",
    pairsWith: ["concierge", "lead-engine"],
    videos: [
      { title: "Design to Launch Process", desc: "Follow a website build from initial mockup through to live deployment." },
      { title: "SEO & Analytics Setup", desc: "How we wire up Google Analytics, Search Console, and on-page SEO from day one." },
    ],
    gallery: [
      { Icon: LayoutIcon, title: "Responsive Design Preview", desc: "Mobile-first layouts that look great on every screen size, from phones to ultrawide monitors." },
      { Icon: SearchIcon, title: "SEO Configuration", desc: "On-page metadata, structured data, and AI-search optimization baked into every page." },
      { Icon: ChartBarIcon, title: "Analytics Dashboard", desc: "Google Analytics and Search Console wired up from day one so you can track what's working." },
    ],
  },
  {
    slug: "lead-engine",
    Icon: ChartBarIcon,
    title: "TSD Lead Engine",
    desc: "A conversion-built landing funnel plus a lead dashboard your team actually works from — capture, qualify, follow up, close.",
    longDesc: "Built for businesses already paying for attention — ads, door-knocking, referral networks — whose leads still land in an inbox nobody owns. Forms tuned to convert, spam-proofed, multilingual when your market needs it, with every lead tracked to an outcome.",
    tags: ["Landing funnel", "Lead dashboard", "Follow-up", "Spam-proof"],
    gradient: "linear-gradient(135deg, #1d3a66 0%, #4B9CD3 100%)",
    saves: "Stops referrals and ad clicks from dying in an unread inbox.",
    savesRows: [
      { label: "Three recovered leads a month at a $250 job", value: "≈ $750 /mo" },
      { label: "Hours re-typing leads into spreadsheets", value: "≈ $300 /mo" },
      { label: "TSD Lead Engine", value: "one fixed-price build" },
    ],
    savesNote: "Recovery assumes leads that currently get no callback. Your close rate sets the real number.",
    proof: "Running live for a Carolina insurance agency: a trilingual funnel and a dashboard their canvassing team works every day.",
    sheetLine: "One recovered lead a month typically covers the build inside a year.",
    included: [
      "Conversion-tuned landing funnel (multilingual when your market needs it)",
      "Lead dashboard with statuses, notes, and ownership",
      "Automated follow-up and instant notifications",
      "Spam protection and email deliverability done right",
      "Analytics wired to real outcomes — not just visits",
    ],
    timeline: "2-3 weeks from kickoff to live.",
    price: "Scoped to your funnel and quoted as a fixed price after a free fit call — estimate on the /pricing calculator. Managed by us, or owned by you, like everything else we build.",
    pairsWith: ["websites", "front-desk"],
    videos: [
      { title: "Lead Engine Walkthrough", desc: "A lead arrives, gets qualified, lands on the dashboard, and gets worked to a close." },
    ],
    gallery: [
      { Icon: ChartBarIcon, title: "The Lead Dashboard", desc: "Every lead with a status, an owner, and a next step — worked from any phone." },
      { Icon: BoltIcon, title: "Instant Follow-up", desc: "Automated first-touch and notifications so no lead waits until Monday." },
      { Icon: ClipboardIcon, title: "Field-Team View", desc: "A canvasser-friendly view for teams that sell door to door or on site." },
    ],
  },
  {
    slug: "cost-cut-audit",
    Icon: ClipboardIcon,
    title: "TSD Cost-Cut Audit",
    desc: "We tear down your software, subscription, and vendor bills line by line — then cut, replace, or renegotiate what you stopped needing.",
    longDesc: "Most established businesses carry years of vendor sediment: the site guy, the booking platform, the marketing tool someone sold you in 2019. We map every recurring charge, show the overlap, and hand you a kill list with a switch plan for each cut.",
    tags: ["Bill teardown", "Kill list", "Switch plan", "Guaranteed"],
    gradient: "linear-gradient(135deg, #13294B 0%, #2c5f8a 100%)",
    saves: "Found $540/mo at one local bakery. If we don't find our fee in annual savings, it's free.",
    savesRows: [
      { label: "Found at one local bakery", value: "$540 /mo" },
      { label: "Typical overlap — two tools doing one job", value: "$50–300 /mo" },
      { label: "The audit", value: "flat fee, quoted on your fit call" },
    ],
    savesNote: "The bakery's cuts: a $300+/mo website vendor and a domain middleman. Annualized, $6,480.",
    proof: "$540 a month — $6,480 a year — cut for a local bakery by replacing its website vendor and a domain middleman.",
    sheetLine: "If the audit doesn't find at least its fee in annual savings, it's free.",
    riskReversal: "If the audit doesn't find at least its fee in annual savings, it's free.",
    included: [
      "Line-by-line teardown of software, subscription, and vendor spend",
      "Overlap and dead-weight map — what's duplicated, what's unused",
      "A kill list with dollar amounts on every line",
      "A switch plan and migration help for each cut",
      "30-day check-in after the cuts land",
    ],
    timeline: "One week from statements-in to kill-list-out.",
    price: "A flat fee, quoted on your fit call. The guarantee does the underwriting: if we don't find at least the fee in annual savings, you pay nothing.",
    pairsWith: ["websites", "booking-bridge"],
    videos: [
      { title: "What an Audit Finds", desc: "A real teardown: the overlap map, the kill list, and the switch plan." },
    ],
    gallery: [
      { Icon: ClipboardIcon, title: "Line-Item Teardown", desc: "Every recurring charge mapped: what it does, what it overlaps, what it should cost." },
      { Icon: ChartBarIcon, title: "Before / After", desc: "Monthly spend before the audit and after the kill list lands." },
    ],
  },
];

/* Smaller pieces that ride along with a build rather than selling alone.
   Rendered as the add-ons strip on /services; still individually
   selectable line items in the pricing estimator. */
export const ADDONS = [
  { name: "Reviews & reputation", blurb: "Auto-requested after each job; monitored on Google + Yelp." },
  { name: "Lead follow-up", blurb: "Re-engages old leads, no-shows, and stale quotes." },
  { name: "Local SEO", blurb: "Google Business Profile and the map pack." },
  { name: "Workflow automations", blurb: "Make/Zapier glue for the repetitive busywork." },
];

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);
