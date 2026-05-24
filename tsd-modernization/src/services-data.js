import { C } from "./shared";
import {
  AIIcon, WebsiteIcon, ProcessIcon,
  BotIcon, CogIcon,
  BoltIcon, ChartBarIcon, CalendarIcon,
  LayoutIcon, SearchIcon, ChatBubbleIcon, MapIcon, ClipboardIcon,
} from "./icons";

export const SERVICES = [
  {
    slug: "websites",
    Icon: WebsiteIcon,
    title: "Custom Websites",
    desc: "A fast, modern site that finally matches your reputation — built to convert, easy to update, and yours to keep. The storefront the AI runs behind.",
    longDesc: "We build on modern frameworks (React, Vite) so the site is fast, accessible, and easy to maintain. The source code is yours from day one, with written and video documentation so your team can keep it current without calling us.",
    tags: ["React", "SEO", "Mobile-First", "Performance", "Analytics"],
    gradient: C.gradientAccent,
    included: [
      "Custom-designed, mobile-first website",
      "On-page SEO + metadata tuned for search and AI visibility",
      "Google Analytics + Search Console wiring",
      "Contact form + AI chat integration",
      "Written + video handoff documentation",
      "Source code, credentials, and runbook yours at handoff",
    ],
    timeline: "2-4 weeks from approved mockup to launch.",
    price: "Custom, fixed-price builds scoped to your pages, content, and the systems you already run. Build an estimate on the /pricing calculator; the exact price comes from a free fit call. Source code yours from day one.",
    videos: [
      { title: "Design to Launch Process", desc: "Follow a website build from initial mockup through to live deployment." },
      { title: "SEO & Analytics Setup", desc: "How we wire up Google Analytics, Search Console, and on-page SEO from day one." },
      { title: "Handoff Documentation", desc: "See the video + written guides we create so you can manage your own content." },
    ],
    gallery: [
      { Icon: LayoutIcon, title: "Responsive Design Preview", desc: "Mobile-first layouts that look great on every screen size, from phones to ultrawide monitors." },
      { Icon: SearchIcon, title: "SEO Configuration", desc: "On-page metadata, structured data, and AI-search optimization baked into every page." },
      { Icon: ChartBarIcon, title: "Analytics Dashboard", desc: "Google Analytics and Search Console wired up from day one so you can track what's working." },
      { Icon: ChatBubbleIcon, title: "AI Chat Integration", desc: "Your AI front desk or site assistant embedded right into the site design." },
    ],
  },
  {
    slug: "ai-integration",
    Icon: AIIcon,
    title: "AI That Runs the Work",
    desc: "Custom AI built on your business so the work doesn't wait on you — TSD Front Desk answers the phone and chat and books the job; TSD Concierge answers visitor questions from your own content and catalog.",
    longDesc: "From a front desk that captures the after-hours call you'd have lost to a site assistant that puts your expertise on every page, we build AI that takes the repetitive work off the owner — then keep it sharp with optional Managed AI.",
    tags: ["TSD Front Desk", "TSD Concierge", "RAG search", "Automation", "Scheduling"],
    gradient: C.gradientPrism,
    included: [
      "TSD Front Desk — AI receptionist for phone + chat that qualifies and books",
      "TSD Concierge — site assistant that answers from your content + catalog",
      "Semantic + image search across your products, docs, and videos",
      "Workflow automations (Make / Zapier) for the repetitive busywork",
      "Built on your real intake; optional Managed AI keeps it current after launch",
    ],
    timeline: "1-3 weeks from kickoff to launch.",
    price: "Scoped to your business and quoted as a fixed price after a free fit call. Get a realistic estimate from the /pricing calculator. Keeping the AI sharp after launch — re-indexing, prompt and model upkeep, monitoring — is optional Managed AI from $97/mo, and you can cancel anytime.",
    videos: [
      { title: "TSD Front Desk Walkthrough", desc: "See how the AI receptionist answers a call, qualifies the lead, and books the job." },
      { title: "TSD Concierge in Action", desc: "Watch the site assistant answer visitor questions from a real content + product catalog." },
      { title: "Workflow Automation Demo", desc: "A Make/Zapier automation routing leads, scheduling calls, and updating your CRM automatically." },
    ],
    gallery: [
      { Icon: BotIcon, embed: "chatbot-demo", title: "TSD Concierge — Site Assistant", desc: "Branded AI assistant embedded on a client's site, answering questions and capturing leads 24/7." },
      { Icon: BoltIcon, embed: "make-flow-demo", title: "Automation Flow", desc: "Multi-step automation connecting a contact form to CRM, email sequences, and calendar booking." },
      { Icon: CalendarIcon, title: "Books From Your Calendar", desc: "TSD Front Desk captures name, service, and urgency, then books a real slot in real time." },
      { Icon: ChartBarIcon, title: "Monthly Insight Report", desc: "Managed AI keeps the agent current and reports what got captured and booked each month." },
    ],
  },
  {
    slug: "process-modernization",
    Icon: ProcessIcon,
    title: "Automation & Growth",
    desc: "The systems that fill the calendar and protect your reputation — TSD Booking Bridge to consolidate booking and automate the busywork, plus reviews, lead follow-up, and local SEO so more of the right people find and book you.",
    longDesc: "We start by mapping where time and revenue leak — scattered booking, missed follow-ups, lost reviews — then build the automation and growth pieces that close the gaps. Everything runs on the tools you already pay for.",
    tags: ["TSD Booking Bridge", "Reviews", "Lead follow-up", "Local SEO", "Automation"],
    gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)",
    included: [
      "TSD Booking Bridge — one booking front door + workflow automation",
      "Reviews & reputation — auto-requests after each job, monitoring across Google + Yelp",
      "Lead follow-up — re-engage old leads, no-shows, and stale quotes",
      "Local SEO — Google Business Profile + local search visibility",
      "Optional paid scope-and-recommend if you'd rather start small first",
    ],
    timeline: "We sequence by impact — most pieces ship within 1-3 weeks.",
    price: "Scoped to the size of the workflow and quoted as a fixed price after a free fit call. Build an estimate on the /pricing calculator. A paid scope-and-recommend is available as a stepping stone if you'd rather start small before a full build — ask about it on your fit call. 100% money-back guarantee.",
    videos: [
      { title: "Booking Bridge Walkthrough", desc: "See scattered booking consolidated into one front door, synced to your calendar." },
      { title: "Reviews & Follow-up in Action", desc: "How automated review requests and lead follow-up recover revenue you already earned." },
    ],
    gallery: [
      { Icon: CalendarIcon, title: "Consolidated Booking", desc: "One booking front door wired to the system you already use, with calendar sync and lead routing." },
      { Icon: ChartBarIcon, title: "Reviews & Reputation", desc: "Auto-requested reviews after each job, plus monitoring and alerts across Google and Yelp." },
      { Icon: MapIcon, title: "Local SEO / Google Profile", desc: "Google Business Profile optimization and local content so you show up in the map pack." },
    ],
  },
];

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);
