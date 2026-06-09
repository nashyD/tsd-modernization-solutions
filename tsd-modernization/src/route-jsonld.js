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

const PRICE_CURRENCY = "USD";

/* TSD is a permanent studio — offers are open-ended, with no cohort
   hard-stop. Custom builds are quoted per project, so we publish a
   "starting at" floor via priceSpecification (minPrice) rather than a
   single fixed price, and let the /pricing estimator + fit call set the
   exact number. */
const offer = ({ name, description, url, minPrice }) => ({
  "@type": "Offer",
  name,
  description,
  priceSpecification: {
    "@type": "PriceSpecification",
    priceCurrency: PRICE_CURRENCY,
    minPrice,
  },
  availability: "https://schema.org/InStock",
  url,
  seller: PROVIDER,
});

/* Recurring Managed AI — published as a subscription offer with a price
   range. Optional, cancel anytime. */
const subscriptionOffer = ({ name, description, url, minPrice, maxPrice }) => ({
  "@type": "Offer",
  name,
  description,
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    priceCurrency: PRICE_CURRENCY,
    minPrice,
    maxPrice,
    unitText: "MONTH",
    billingDuration: 1,
    billingIncrement: 1,
  },
  availability: "https://schema.org/InStock",
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

const segmentAudience = (segment) => ({
  "@type": "BusinessAudience",
  name: segment,
  audienceType: segment,
});

const BUILD_OFFER = offer({
  name: "Custom Website + AI Build",
  minPrice: "3000",
  description:
    "Custom website plus AI — TSD Front Desk receptionist, TSD Concierge site assistant, or TSD Booking Bridge automation, mixed to fit. On-page SEO, analytics wiring, and your choice of managed or owned. Custom, fixed-price builds — get a real range from the /pricing estimator, exact price from a free fit call. 100% money-back guarantee, 48-hour written proposal.",
  url: `${SITE}/pricing`,
});

const MANAGED_AI_OFFER = subscriptionOffer({
  name: "Managed AI",
  minPrice: "73",
  maxPrice: "373",
  description:
    "Optional monthly upkeep for your AI: re-indexing new content, prompt and model upkeep, monitoring, and a monthly report. Starts after launch, cancel anytime. A website-only build doesn't need it.",
  url: `${SITE}/pricing`,
});

/* /pricing — FAQPage + OfferCatalog. Mirrors the canonical FAQ copy in
   Pricing.jsx. */
const PRICING_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE}/pricing#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "How does pricing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every build is a fixed price, quoted in a written proposal within 48 hours of a free fit call. The estimator gives you a realistic range; the exact number depends on your content, your catalog, and the systems you already run. Get a real range from the /pricing estimator.",
      },
    },
    {
      "@type": "Question",
      name: "What's Managed AI, and is it required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI tools drift if nobody tends them — new content to index, prompts to tune, models that keep improving. Managed AI keeps yours sharp: re-indexing, prompt and model upkeep, monitoring, and a monthly report, from $73/mo. It's optional, starts after launch, and you can cancel anytime. A website-only build doesn't need it.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own it, or do you manage it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your choice. Owned: source code, credentials, and a runbook are yours from day one, with written and video docs and a live training session — you or your IT team run it. Managed: we host it and handle every change for you, from $49/mo for a site or $73/mo for AI, cancel anytime. Never a lock-in either way.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a build take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most websites and AI builds run 2-4 weeks from approved scope to launch. Larger, multi-system engagements — big catalogs, multiple integrations — are scoped individually.",
      },
    },
    {
      "@type": "Question",
      name: "What kinds of businesses do you work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Established local businesses whose digital presence has fallen behind their reputation — salons and spas, specialty automotive, wholesale and supply, studios and makers, professional services, specialty retail. If the business runs on the owner's hours, that's exactly what we fix.",
      },
    },
    {
      "@type": "Question",
      name: "What's the first step?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A free fit call — 30 minutes, in person or remote. We'll tell you honestly whether we can help, and if so, send a fixed-price proposal within 48 hours.",
      },
    },
    {
      "@type": "Question",
      name: "What's your service area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities. Fit calls can be done in person or remote.",
      },
    },
  ],
};

const PRICING_CATALOG = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SITE}/pricing#catalog`,
  name: "Websites + AI for Established Charlotte Businesses",
  url: `${SITE}/pricing`,
  itemListElement: [BUILD_OFFER, MANAGED_AI_OFFER],
};

/* /process — HowTo with 4 steps from STEPS in Process.jsx. */
const PROCESS_HOWTO = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${SITE}/process#howto`,
  name: "How TSD Modernization Solutions runs an engagement",
  description:
    "Our four-step process: free fit call, written proposal within 48 hours, 2-4 week build with weekly check-ins, and launch your way — managed by us, or a full handoff with docs and training.",
  totalTime: "P28D",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Fit call",
      text: "A free 30-minute conversation, in-person or remote, where we walk through your business, your operations, and what you'd want modernized. No commitment. We'll tell you honestly whether we can help.",
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
      name: "Launch",
      text: "Go live your way: Managed — we host it and make every change for you, just text us (from $49/mo) — or Owned, where the source code, credentials, and deployment are yours from day one with a live training session. Cancel Managed anytime; never a lock-in.",
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
  name: "AI Receptionist, Site Assistant & Booking Automation",
  description:
    "AI built on your real intake: TSD Front Desk answers phone and chat, qualifies, and books; TSD Concierge answers visitor questions from your content and catalog with semantic and image search; TSD Booking Bridge consolidates booking and routes leads. Managed by us, or owned by you;optional Managed AI keeps it sharp, cancel anytime.",
  serviceType: "AI Integration and Workflow Automation",
  slug: "/services/ai-integration",
  offers: [BUILD_OFFER, MANAGED_AI_OFFER],
});

const SERVICE_WEB = service({
  name: "Custom Website Design & Redesign",
  description:
    "Fast, mobile-first custom websites with on-page SEO, analytics and Search Console wiring, and full written and video handoff documentation. Custom, fixed-price builds — get a real range from the /pricing estimator, launched in 2-4 weeks, managed by us or owned by you.",
  serviceType: "Web Design and Development",
  slug: "/services/websites",
  offers: BUILD_OFFER,
});

const SERVICE_PROCESS = service({
  name: "Process Modernization & Workflow Automation",
  description:
    "We take the repetitive work off the owner's plate — consolidated booking, calendar and lead-routing automation, and the workflow glue behind it, built on the tools you already pay for so the business keeps moving when you step away.",
  serviceType: "Business Process Consulting",
  slug: "/services/process-modernization",
  offers: BUILD_OFFER,
});

/* /ai-receptionist — Service for the TSD Front Desk AI receptionist. */
const SERVICE_RECEPTIONIST = service({
  name: "TSD Front Desk — AI Receptionist",
  description:
    "TSD Front Desk answers your phone and chat day or night, qualifies the lead, and books the job, then texts you a one-paragraph summary. Built on your real intake flow. Managed by us, or owned by you;recurring Managed AI keeps it sharp, cancel anytime. 100% money-back guarantee.",
  serviceType: "AI Phone Answering Service",
  slug: "/ai-receptionist",
  offers: [BUILD_OFFER, MANAGED_AI_OFFER],
});

/* Segment-page Service nodes — custom website + AI build, different audience. */
const SERVICE_SALONS = service({
  name: "Custom Website + AI for Charlotte Salons & Spas",
  description:
    "Custom website plus consolidated booking, after-hours AI chat that answers from your services, and a TSD Front Desk receptionist that books while you're with a client, for established Charlotte salons and spas. Managed by us, or owned by you.",
  serviceType: "Web Design and AI Tooling for Salons and Spas",
  slug: "/salons",
  offers: BUILD_OFFER,
  audience: segmentAudience("Hair Salons, Nail Studios, and Spas"),
});

const SERVICE_AUTO = service({
  name: "Custom Website + AI for Charlotte Specialty Auto Shops",
  description:
    "Custom website plus online quote requests, service and parts catalog lookup, and a TSD Front Desk receptionist that captures the call you'd have missed, for established Charlotte specialty automotive shops. Managed by us, or owned by you.",
  serviceType: "Web Design and AI Tooling for Specialty Automotive",
  slug: "/auto-shops",
  offers: BUILD_OFFER,
  audience: segmentAudience("Specialty Automotive Shops"),
});

const SERVICE_RESTAURANTS = service({
  name: "Custom Website + AI for Charlotte Restaurants",
  description:
    "Custom website plus reservations, online ordering, and a TSD Concierge assistant that answers menu and hours questions from your own content, for established Charlotte restaurants. Managed by us, or owned by you.",
  serviceType: "Web Design and AI Tooling for Restaurants",
  slug: "/restaurants",
  offers: BUILD_OFFER,
  audience: segmentAudience("Restaurants and Food Service"),
});

/* Routes mapped to the JSON-LD nodes that render on each one.
   Always an array — RouteMeta emits one <script> per node. */
export const ROUTE_JSONLD = {
  "/pricing": [PRICING_FAQ, PRICING_CATALOG],
  "/process": [PROCESS_HOWTO],
  "/team": [TEAM_LIST],
  "/contact": [CONTACT_PAGE],

  "/services/ai-integration": [SERVICE_AI],
  "/services/websites": [SERVICE_WEB],
  "/services/process-modernization": [SERVICE_PROCESS],

  "/ai-receptionist": [SERVICE_RECEPTIONIST],

  "/salons": [SERVICE_SALONS],
  "/auto-shops": [SERVICE_AUTO],
  "/restaurants": [SERVICE_RESTAURANTS],
};
