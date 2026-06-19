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

import { POSTS } from "./news-data.js";

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
const offer = ({ name, description, url, minPrice }) => {
  const node = {
    "@type": "Offer",
    name,
    description,
    availability: "https://schema.org/InStock",
    url,
    seller: PROVIDER,
  };
  /* Flat-fee offers quoted per engagement (e.g. the Cost-Cut Audit)
     omit minPrice rather than publish a made-up floor. */
  if (minPrice) {
    node.priceSpecification = {
      "@type": "PriceSpecification",
      priceCurrency: PRICE_CURRENCY,
      minPrice,
    };
  }
  return node;
};

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
    "Custom website plus AI — TSD Front Desk receptionist, TSD Concierge site assistant, or TSD Lead Engine funnel, mixed to fit. On-page SEO, analytics wiring, and your choice of managed or owned. Custom, fixed-price builds — get a real range from the /pricing estimator, exact price from a free fit call. 100% money-back guarantee, 48-hour written proposal.",
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
        text: "Your choice, and the estimator prices both. Owned carries a higher one-time fee with nothing recurring — source code, credentials, a runbook, written and video docs, and a live training session are yours from day one, and the full handoff is in the number. Managed starts lower and adds a monthly: we host it and handle every change for you, from $49/mo for a site or $73/mo for AI, cancel anytime. Never a lock-in either way.",
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

/* Service nodes for the six /services/{slug} pages. minPrice floors
   mirror the estimator's per-product lows (placeholders pending Nash's
   pricing sign-off — change them together). */
const SERVICE_FRONT_DESK = service({
  name: "TSD Front Desk — AI Receptionist",
  description:
    "An AI receptionist on your existing phone line and website chat: answers 24/7, qualifies the caller, and books real calendar slots, then texts you a summary. Replaces a $1,500–2,500/mo front-desk hire for a fraction of the cost. Free if it books nothing in your first 30 days.",
  serviceType: "AI Phone Answering Service",
  slug: "/services/front-desk",
  offers: [
    offer({
      name: "TSD Front Desk Setup",
      minPrice: "1200",
      description: "Custom AI receptionist built on your real intake and voice — phone + chat, calendar booking, SMS summaries. 30-day booked-appointment guarantee.",
      url: `${SITE}/services/front-desk`,
    }),
    MANAGED_AI_OFFER,
  ],
});

const SERVICE_CONCIERGE = service({
  name: "TSD Concierge — Site Assistant",
  description:
    "A site assistant trained on your own catalog, documents, and policies. Visitors ask in plain English; it answers from your real products and pages with the source linked, 24/7 — and saves the hours your staff spends repeating the same answers.",
  serviceType: "AI Site Assistant and Catalog Search",
  slug: "/services/concierge",
  offers: [
    offer({
      name: "TSD Concierge Build",
      minPrice: "4100",
      description: "Custom-trained site assistant with semantic + image search across your products, docs, and videos, cited answers, and lead capture.",
      url: `${SITE}/services/concierge`,
    }),
    MANAGED_AI_OFFER,
  ],
});

const SERVICE_WEB = service({
  name: "Custom Website Design & Redesign",
  description:
    "Fast, mobile-first custom websites with on-page SEO, analytics and Search Console wiring, and full written and video handoff documentation. Launched in 2-4 weeks. Saves the agency retainer: Managed hosting + edits from $49/mo, or owned outright.",
  serviceType: "Web Design and Development",
  slug: "/services/websites",
  offers: offer({
    name: "Custom Website Build",
    minPrice: "2900",
    description: "Custom-designed, mobile-first website with SEO, analytics, and AI chat integration — managed by us from $49/mo, or owned by you outright.",
    url: `${SITE}/services/websites`,
  }),
});

const SERVICE_LEAD_ENGINE = service({
  name: "TSD Lead Engine — Landing Funnel + Lead Dashboard",
  description:
    "A conversion-built landing funnel plus a lead dashboard your team actually works from — capture, qualify, follow up, close. Stops referrals and ad clicks from dying in an unread inbox. Running live for a Carolina insurance agency.",
  serviceType: "Lead Generation Funnel and CRM Tooling",
  slug: "/services/lead-engine",
  offers: offer({
    name: "TSD Lead Engine Build",
    minPrice: "2400",
    description: "Conversion-tuned landing funnel (multilingual when needed), lead dashboard with statuses and ownership, automated follow-up, spam protection, and outcome analytics.",
    url: `${SITE}/services/lead-engine`,
  }),
});

const SERVICE_AUDIT = service({
  name: "TSD Cost-Cut Audit",
  description:
    "The free diagnostic inside every 30-minute fit call: a line-by-line teardown of your software, subscription, and vendor bills, with an overlap map, a kill list with dollar amounts, and a switch plan for every cut. $540/mo found at one local bakery. Yours to keep whether or not you hire us.",
  serviceType: "Business Cost Reduction Audit",
  slug: "/services/cost-cut-audit",
  offers: offer({
    name: "TSD Cost-Cut Audit",
    description: "Included free in every 30-minute fit call. We tear down your software and vendor bills and hand over a kill list — no fee, no obligation.",
    url: `${SITE}/services/cost-cut-audit`,
  }),
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

/* /news — a Blog node, plus one BlogPosting per post (appended below the
   export). Generated from the posts catalog so a new post in news-data.js
   gets its Article schema for search + AI crawlers automatically. */
const NEWS_BLOG = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE}/news#blog`,
  name: "TSD Modernization Solutions — Field Notes",
  description:
    "Short, honest updates on the websites and AI TSD Modernization Solutions ships for local Charlotte-metro businesses.",
  url: `${SITE}/news`,
  publisher: PROVIDER,
};

const blogPosting = (p) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${SITE}/news/${p.slug}#post`,
  headline: p.title,
  description: p.excerpt,
  datePublished: p.dateISO,
  dateModified: p.dateISO,
  url: `${SITE}/news/${p.slug}`,
  mainEntityOfPage: `${SITE}/news/${p.slug}`,
  author: PROVIDER,
  publisher: PROVIDER,
  isPartOf: { "@id": `${SITE}/news#blog` },
});

/* Routes mapped to the JSON-LD nodes that render on each one.
   Always an array — RouteMeta emits one <script> per node. */
export const ROUTE_JSONLD = {
  "/pricing": [PRICING_FAQ, PRICING_CATALOG],
  "/process": [PROCESS_HOWTO],
  "/team": [TEAM_LIST],
  "/contact": [CONTACT_PAGE],
  "/news": [NEWS_BLOG],

  "/services/front-desk": [SERVICE_FRONT_DESK],
  "/services/concierge": [SERVICE_CONCIERGE],
  "/services/websites": [SERVICE_WEB],
  "/services/lead-engine": [SERVICE_LEAD_ENGINE],
  "/services/cost-cut-audit": [SERVICE_AUDIT],

  "/salons": [SERVICE_SALONS],
  "/auto-shops": [SERVICE_AUTO],
  "/restaurants": [SERVICE_RESTAURANTS],
};

/* One BlogPosting per news post — appended so a new post in news-data.js
   automatically gets its Article schema. */
POSTS.forEach((p) => {
  ROUTE_JSONLD[`/news/${p.slug}`] = [blogPosting(p)];
});
