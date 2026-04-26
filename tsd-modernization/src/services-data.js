import { C } from "./shared";
import {
  AIIcon, WebsiteIcon, ProcessIcon,
  BotIcon,
  BoltIcon, ChartBarIcon, CalendarIcon,
  LayoutIcon, SearchIcon, ChatBubbleIcon, MapIcon, ClipboardIcon,
} from "./icons";

export const SERVICES = [
  {
    slug: "ai-integration",
    Icon: AIIcon,
    title: "AI Integration & Automation",
    desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights. We set up the tools, train your team, and document everything.",
    longDesc: "From customer-facing chatbots that handle FAQs to backend automations that replace hours of manual data entry, we build AI solutions that actually make sense for your business size and budget.",
    tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling", "Email Automation"],
    gradient: C.gradientPrism,
    included: [
      "Custom AI chatbot trained on your business",
      "Make automation workflows",
      "AI-powered reporting dashboards",
      "Calendar & appointment automation",
      "Staff training on every tool we deploy",
    ],
    timeline: "1-2 weeks from kickoff to launch.",
    price: "Included in the Summer 2026 Website + AI Bundle: $2,000 founding rate (standard $4,000). Start with a $250 Discovery audit to scope the integration.",
    videos: [
      { title: "Chatbot Setup Walkthrough", desc: "See how we build and train a custom AI chatbot for your business in under a week." },
      { title: "Workflow Automation Demo", desc: "Watch a Make/Zapier automation route leads, schedule calls, and update your CRM automatically." },
      { title: "AI Reporting Dashboard", desc: "A live look at how AI-generated insights surface trends you'd otherwise miss." },
    ],
    gallery: [
      { Icon: BotIcon, title: "Custom Chatbot Interface", desc: "Branded chatbot widget embedded on a client's homepage, answering FAQs and capturing leads 24/7." },
      { Icon: BoltIcon, title: "Make Automation Flow", desc: "Multi-step automation connecting a contact form to CRM, email sequences, and calendar booking." },
      { Icon: ChartBarIcon, title: "AI Reporting Dashboard", desc: "Real-time analytics dashboard with AI-generated summaries and trend detection." },
      { Icon: CalendarIcon, title: "Smart Scheduling", desc: "Automated calendar system that syncs availability, sends reminders, and handles rescheduling." },
    ],
  },
  {
    slug: "websites",
    Icon: WebsiteIcon,
    title: "Website Creation & Redesign",
    desc: "We build sites that load fast, look good on phones, and show up in search results. Every site comes with written and video documentation so you can update content without calling us.",
    longDesc: "One founder stays on call for fixes through August 31, 2026 on every Summer 2026 cohort build. We use modern frameworks like React and Vite to build sites that are fast, accessible, and easy to maintain.",
    tags: ["React", "SEO", "Mobile-First", "CMS", "Performance", "Analytics"],
    gradient: C.gradientAccent,
    included: [
      "5-8 page custom-designed website",
      "Mobile-first responsive build",
      "On-page SEO and metadata optimized for AI search visibility",
      "Google Analytics + Search Console wiring",
      "Contact form & chatbot integration",
      "Written + video handoff documentation",
      "Founder on call for fixes through Aug 31, 2026",
    ],
    timeline: "2-4 weeks from approved mockup to launch.",
    price: "Bundled with the Summer 2026 Website + AI offer: $2,000 founding rate (standard $4,000).",
    videos: [
      { title: "Design to Launch Process", desc: "Follow a website build from initial mockup through to live deployment." },
      { title: "SEO & Analytics Setup", desc: "How we wire up Google Analytics, Search Console, and on-page SEO from day one." },
      { title: "Handoff Documentation", desc: "See the video + written guides we create so you can manage your own content." },
    ],
    gallery: [
      { Icon: LayoutIcon, title: "Responsive Design Preview", desc: "Mobile-first layouts that look great on every screen size, from phones to ultrawide monitors." },
      { Icon: SearchIcon, title: "SEO Configuration", desc: "On-page metadata, structured data, and AI search optimization baked into every page." },
      { Icon: ChartBarIcon, title: "Analytics Dashboard", desc: "Google Analytics and Search Console wired up from day one so you can track what's working." },
      { Icon: ChatBubbleIcon, title: "Chatbot Integration", desc: "Seamless chatbot widget embedded into the site design for instant visitor engagement." },
    ],
  },
  {
    slug: "process-modernization",
    Icon: ProcessIcon,
    title: "Process Modernization",
    desc: "Replace spreadsheets, paper forms, and manual processes with streamlined digital tools. We audit your current workflow and build exactly what you need.",
    longDesc: "Whether it's a custom dashboard, automated invoicing, or a client portal, we identify the bottlenecks and build targeted solutions that save your team real time every week.",
    tags: ["Workflows", "Dashboards", "Integrations", "Training", "Documentation"],
    gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)",
    included: [
      "2-3 hour structured tech audit (in-person or remote)",
      "Written modernization roadmap",
      "Tool & platform recommendations with cost estimates",
      "Priority sequence + estimated ROI per item",
      "No obligation to continue with us",
    ],
    timeline: "Audit completed in a single session. Written roadmap delivered within 48 hours.",
    price: "$250 flat. This is the Discovery engagement of the Summer 2026 cohort, also included as Phase I of the $2,000 Website + AI Bundle.",
    videos: [
      { title: "Tech Audit Session Preview", desc: "A preview of what a structured tech audit looks like and the questions we walk through." },
      { title: "Roadmap Walkthrough", desc: "See an example modernization roadmap with priorities, costs, and ROI estimates." },
    ],
    gallery: [
      { Icon: SearchIcon, title: "Process Mapping", desc: "Visual breakdown of current workflows showing where time and money are being lost." },
      { Icon: MapIcon, title: "Modernization Roadmap", desc: "Prioritized action plan with cost estimates, ROI projections, and recommended timeline." },
      { Icon: ClipboardIcon, title: "Tool Recommendations", desc: "Platform-by-platform comparison tailored to your business size, budget, and technical comfort." },
    ],
  },
];

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);
