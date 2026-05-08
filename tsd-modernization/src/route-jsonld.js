/* Per-route JSON-LD structured data.
   Emitted by RouteMeta in Layout.jsx as <script type="application/ld+json">
   tags injected into <head> at SSG build time, so non-JS crawlers (Google's
   first-pass renderer, Bing, AI search engines, link-preview bots) see the
   right schema per URL.

   The global ProfessionalService schema for TSD lives in index.html under
   @id "https://tsd-modernization.com/#business" and is present on every
   route. The schemas here add page-specific entities (Service, Offer,
   FAQPage, HowTo, etc.) that reference the business via that @id, so we
   don't duplicate org-level fields like address / telephone / founders. */

const SITE = "https://tsd-modernization.com";
const BUSINESS_ID = `${SITE}/#business`;
const PROVIDER = { "@id": BUSINESS_ID };
const AREA_SERVED = [
  { "@type": "City", name: "Charlotte", containedInPlace: { "@type": "State", name: "North Carolina" } },
  { "@type": "City", name: "Gastonia", containedInPlace: { "@type": "State", name: "North Carolina" } },
  { "@type": "City", name: "Belmont", containedInPlace: { "@type": "State", name: "North Carolina" } },
];

/* Cohort framing: the entire summer is a limited-availability window.
   Schema.org availability vocabulary recognizes LimitedAvailability for
   this exact case. validThrough closes the offers on the cohort hard-stop. */
const COHORT_AVAILABILITY = "https://schema.org/LimitedAvailability";
const COHORT_VALID_THROUGH = "2026-08-10";
const PRICE_CURRENCY = "USD";

const offer = ({ name, price, description, url, validThrough = COHORT_VALID_THROUGH }) => ({
  "@type": "Offer",
  name,
  description,
  price,
  priceCurrency: PRICE_CURRENCY,
  availability: COHORT_AVAILABILITY,
  validThrough,
  url,
  seller: PROVIDER,
});

const service = ({ name, description, serviceType, slug, offers, audience }) => {
  const node = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${slug}#service`,
    name,
    description,
    serviceType,
    provider: PROVIDER,
    areaServed: AREA_SERVED,
    url: `${SITE}${slug}`,
  };
  if (offers) node.offers = offers;
  if (audience) node.audience = audience;
  return node;
};

const tradeAudience = (occupation) => ({
  "@type": "BusinessAudience",
  name: occupation,
  audienceType: occupation,
});

const RECEPTIONIST_OFFER = offer({
  name: "After-Hours Lead Capture — Founding Setup",
  price: "497",
  description:
    "One-time founding setup for a custom AI receptionist that answers after-hours, qualifies the lead, and books the job. The agent transfers to the buyer on August 31, 2026 — no subscription forever.",
  url: `${SITE}/ai-receptionist`,
});

const BUILD_OFFER = offer({
  name: "Website + AI Build (Founding Cohort)",
  price: "5000",
  description:
    "Custom website plus AI chatbot or workflow automation, on-page SEO, analytics wiring, and full source-code ownership. Live in 14 days from contract signature or 25% back. Founder on call for fixes through August 31, 2026.",
  url: `${SITE}/pricing`,
});

const FULL_MODERNIZATION_OFFER = offer({
  name: "The Full Modernization (By Application)",
  price: "10000",
  description:
    "Discovery audit, custom website, AI receptionist, one operational integration (ServiceTitan / QuickBooks / Jobber / similar), custom AI re-training on real call data, and weekly written status reports. Outcome guarantee: 15+ qualified leads in pipeline before August 31, 2026, or $5,000 back and the AI integration rebuilt free.",
  url: `${SITE}/pricing`,
});

const AUDIT_OFFER = offer({
  name: "Phase I Discovery Audit",
  price: "1500",
  description:
    "2-3 hour structured tech audit plus written modernization roadmap with prioritized recommendations, cost estimates, and ROI projections. Money-back if we can't surface $25,000 of opportunities.",
  url: `${SITE}/services/process-modernization`,
});

/* /pricing — FAQPage + OfferCatalog with the two cohort tiers. */
const PRICING_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE}/pricing#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Why are your prices so much lower than agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We're a lean team of three founders with minimal overhead. Our founding-cohort rates are deliberately half what we'll charge after Summer 2026, set so we can build our portfolio and earn client trust. You get the same quality at 3-5x less than agency rates.",
      },
    },
    {
      "@type": "Question",
      name: "How does the Summer 2026 cohort work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We operate from May 7 to August 10, 2026 — three founders running together over the summer, capped at ten clients so every project gets the time it needs. Last project start is July 13. After August 10 we hand off; one founder stays on call for fixes through August 31.",
      },
    },
    {
      "@type": "Question",
      name: "How does the free fit call work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 1-2 hour conversation, in-person or remote, where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit. If we're a match, the next step is a written proposal for the Website + AI Build or the Full Modernization within 48 hours. We also offer a standalone $1,500 discovery audit on request.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after my project is done?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every project ends with handoff documentation, video tutorials, and a live training session. You'll run everything independently from there. One founder stays on call for fixes through August 31, 2026; past that, the season closes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to know anything about AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a typical project take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff.",
      },
    },
    {
      "@type": "Question",
      name: "What's your service area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities. Discovery meetings can be done in-person or remote.",
      },
    },
  ],
};

const PRICING_CATALOG = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SITE}/pricing#catalog`,
  name: "Summer 2026 Founding-Cohort Pricing",
  url: `${SITE}/pricing`,
  itemListElement: [BUILD_OFFER, FULL_MODERNIZATION_OFFER],
};

/* /process — HowTo with 4 steps from STEPS in Process.jsx. */
const PROCESS_HOWTO = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${SITE}/process#howto`,
  name: "How TSD Modernization Solutions runs an engagement",
  description:
    "Our four-step process: free fit call, written proposal within 48 hours, 2-4 week build with weekly check-ins, and full handoff with documentation and training.",
  totalTime: "P28D",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Fit call",
      text: "A 1-2 hour conversation, in-person or remote, where we walk through your business, your operations, and what you'd want modernized. Free, no commitment. You leave with a clear read on whether we're the right fit.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Proposal",
      text: "Within 48 hours, you receive a written modernization roadmap with clear scope, timeline, and pricing. Typically 2-4 pages with technical approach, deliverables, and payment schedule.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Build",
      text: "We execute the project on a 2-4 week timeline with regular weekly check-ins and progress updates. Revisions included.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Handoff",
      text: "Every project ends with written documentation, video tutorials, and a live training session. You own the source code, the credentials, and the deployment when we're done. One founder stays on call for fixes through August 31, 2026.",
    },
  ],
};

/* /team — ItemList of the three founders as Person nodes. */
const TEAM_LIST = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE}/team#founders`,
  name: "TSD Modernization Solutions — Founders",
  itemListOrder: "https://schema.org/ItemListUnordered",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Person",
        "@id": `${SITE}/team#nash`,
        name: "Nash Davis",
        jobTitle: "CEO",
        worksFor: PROVIDER,
        alumniOf: { "@type": "CollegeOrUniversity", name: "University of North Carolina at Chapel Hill" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Person",
        "@id": `${SITE}/team#bishop`,
        name: "Bishop Switzer",
        jobTitle: "COO",
        worksFor: PROVIDER,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Person",
        "@id": `${SITE}/team#grant`,
        name: "Grant Tadlock",
        jobTitle: "CFO",
        worksFor: PROVIDER,
      },
    },
  ],
};

/* /missed-call-calculator — WebApplication for the free tool. */
const CALCULATOR_APP = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE}/missed-call-calculator#app`,
  name: "Missed Call Revenue Calculator for Charlotte Trades",
  description:
    "Free four-question calculator that estimates the annual revenue your phone is losing to voicemail. Built for Charlotte HVAC, electricians, and plumbers. No signup, no email gate.",
  url: `${SITE}/missed-call-calculator`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  isAccessibleForFree: true,
  publisher: PROVIDER,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: PRICE_CURRENCY,
  },
};

/* /contact — ContactPage tied to the business. */
const CONTACT_PAGE = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE}/contact#page`,
  name: "Contact TSD Modernization Solutions",
  url: `${SITE}/contact`,
  mainEntity: PROVIDER,
};

/* Service nodes for the three /services/{slug} pages. */
const SERVICE_AI = service({
  name: "AI Integration & Automation for Small Businesses",
  description:
    "Custom AI chatbots trained on your business, Make and Zapier workflow automations, AI-powered reporting dashboards, and calendar/appointment automation. Staff training on every tool deployed. Included in the $5,000 Website + AI Build, launched in 1-2 weeks.",
  serviceType: "AI Integration and Workflow Automation",
  slug: "/services/ai-integration",
  offers: BUILD_OFFER,
});

const SERVICE_WEB = service({
  name: "Custom Website Design & Redesign",
  description:
    "Mobile-first 5-8 page custom websites with on-page SEO, Google Analytics + Search Console wiring, contact form and chatbot integration, and full written + video handoff documentation. Founder on call for fixes through August 31, 2026.",
  serviceType: "Web Design and Development",
  slug: "/services/websites",
  offers: BUILD_OFFER,
});

const SERVICE_PROCESS = service({
  name: "Tech Audits & Process Modernization",
  description:
    "Structured 2-3 hour tech audit (in-person or remote), written modernization roadmap, tool and platform recommendations with cost estimates, priority sequence, and estimated ROI per item. Money-back if we can't surface $25,000 of opportunities.",
  serviceType: "Business Process Consulting",
  slug: "/services/process-modernization",
  offers: AUDIT_OFFER,
});

/* /ai-receptionist — Service for the After-Hours Lead Capture wedge product. */
const SERVICE_RECEPTIONIST = service({
  name: "AI Receptionist (After-Hours Lead Capture)",
  description:
    "Custom AI answers the after-hours call, qualifies the lead, and books the job for Charlotte HVAC, electricians, and plumbers. $497 founding setup, paid once. The agent transfers to the buyer on August 31, 2026 — no subscription forever.",
  serviceType: "AI Phone Answering Service",
  slug: "/ai-receptionist",
  offers: RECEPTIONIST_OFFER,
});

/* Trade-page Service nodes — same offer ($497 receptionist), different audience. */
const SERVICE_HVAC = service({
  name: "AI Receptionist for Charlotte HVAC Contractors",
  description:
    "AI receptionist that books the after-hours emergency call for Charlotte HVAC contractors — AC failures, weekend furnace breakdowns, storm-damaged units — so it doesn't go to a competitor by morning.",
  serviceType: "AI Phone Answering Service for HVAC Contractors",
  slug: "/hvac",
  offers: RECEPTIONIST_OFFER,
  audience: tradeAudience("HVAC Contractors"),
});

const SERVICE_ELECTRICIANS = service({
  name: "AI Receptionist for Charlotte Electrical Contractors",
  description:
    "AI receptionist for Charlotte electricians that captures emergency rewires, panel failures, and after-hours service calls so the on-call rotation doesn't break.",
  serviceType: "AI Phone Answering Service for Electricians",
  slug: "/electricians",
  offers: RECEPTIONIST_OFFER,
  audience: tradeAudience("Electrical Contractors"),
});

const SERVICE_PLUMBERS = service({
  name: "AI Receptionist for Charlotte Plumbers",
  description:
    "AI receptionist for Charlotte plumbers that captures weekend water-heater failures, burst pipes, and no-hot-water Sunday-morning emergencies, then books the truck.",
  serviceType: "AI Phone Answering Service for Plumbers",
  slug: "/plumbers",
  offers: RECEPTIONIST_OFFER,
  audience: tradeAudience("Plumbing Contractors"),
});

/* Relationship-page Service nodes — bundle product ($5,000 build). */
const SERVICE_SALONS = service({
  name: "Custom Website + AI for Charlotte Salons",
  description:
    "Mobile-first website plus booking automation, after-hours AI chat, missed-call recovery, and Instagram-feed integration for Charlotte hair salons, nail studios, and spas. Built in 2-4 weeks. Source code yours from day one.",
  serviceType: "Web Design and AI Tooling for Salons",
  slug: "/salons",
  offers: BUILD_OFFER,
  audience: tradeAudience("Hair Salons, Nail Studios, and Spas"),
});

const SERVICE_AUTO = service({
  name: "Custom Website + AI for Charlotte Auto Shops",
  description:
    "Mobile-first website plus online quote requests, service catalogs, after-hours intake, and AI chat for Charlotte auto repair, body shops, and tire stores. Built in 2-4 weeks. Source code yours from day one.",
  serviceType: "Web Design and AI Tooling for Auto Shops",
  slug: "/auto-shops",
  offers: BUILD_OFFER,
  audience: tradeAudience("Auto Repair Shops, Body Shops, and Tire Stores"),
});

const SERVICE_RESTAURANTS = service({
  name: "Custom Website + AI for Charlotte Restaurants",
  description:
    "Mobile-first website plus reservations, online ordering, and AI chat for menu and hours for Charlotte restaurants, bakeries, and food trucks. Built in 2-4 weeks. Source code yours from day one.",
  serviceType: "Web Design and AI Tooling for Restaurants",
  slug: "/restaurants",
  offers: BUILD_OFFER,
  audience: tradeAudience("Restaurants, Bakeries, and Food Trucks"),
});

/* Routes mapped to the JSON-LD nodes that render on each one.
   Always an array — RouteMeta emits one <script> per node. */
export const ROUTE_JSONLD = {
  "/pricing": [PRICING_FAQ, PRICING_CATALOG],
  "/process": [PROCESS_HOWTO],
  "/team": [TEAM_LIST],
  "/contact": [CONTACT_PAGE],
  "/missed-call-calculator": [CALCULATOR_APP],

  "/services/ai-integration": [SERVICE_AI],
  "/services/websites": [SERVICE_WEB],
  "/services/process-modernization": [SERVICE_PROCESS],

  "/ai-receptionist": [SERVICE_RECEPTIONIST],

  "/hvac": [SERVICE_HVAC],
  "/electricians": [SERVICE_ELECTRICIANS],
  "/plumbers": [SERVICE_PLUMBERS],

  "/salons": [SERVICE_SALONS],
  "/auto-shops": [SERVICE_AUTO],
  "/restaurants": [SERVICE_RESTAURANTS],
};
