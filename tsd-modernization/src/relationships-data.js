/* Relationship-channel landing page content. Each entry is a vertical-
   specific page for warm leads who arrived via founder DM, founder text,
   or word-of-mouth (per the v2 two-motion model: trades = cold ads to
   /hvac etc.; relationships = founder outreach to these vertical pages).

   These pages don't try to convert cold traffic — that's what the trade
   pages do. They confirm "yes we work with your vertical" and show what
   TSD would ship, then funnel to /contact (with ?ref={vertical} for
   attribution) or /pricing.

   Copy is bundle-led, not receptionist-led. The relationship buyer is
   shopping for a website + AI tooling combo, not the standalone $497
   wedge product. */

export const RELATIONSHIPS = {
  salons: {
    slug: "salons",
    vertical: "Charlotte Salons",
    routeMetaTitle: "Custom Website + AI for Charlotte Salons | TSD Modernization Solutions",
    routeMetaDesc: "Custom website and AI tools for Charlotte hair salons, nail studios, and spas — booking automation, after-hours chat, missed-call recovery. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
    hero: {
      h1: "Charlotte salons. Your booth doesn't book itself.",
      h1Italic: "Let your website do the work.",
      sub: "Custom website + AI tools for Charlotte hair salons, nail studios, and spas. Booking automation, after-hours chat, missed-call recovery. Built and shipped in 2-4 weeks.",
    },
    build: {
      title: "Here's what we'd ship for your salon.",
      sub: "Six deliverables, fixed scope, fixed price. Source code + GitHub repo are yours from day one — past August 31, your codebase has a Claude-powered co-pilot for fixes and updates.",
      bullets: [
        "Mobile-first site: stylists, services, prices, booking link",
        "Online booking widget plugged into your existing system (Square, Booksy, Vagaro)",
        "AI chat: hours, services, \"do you do balayage?\" — 24/7 answers",
        "After-hours missed-call recovery: caller gets a text with your booking link",
        "Instagram-feed integration: portfolio stays current automatically",
        "Source code + GitHub repo are yours from day one",
      ],
    },
  },

  "auto-shops": {
    slug: "auto-shops",
    vertical: "Charlotte Auto Shops",
    routeMetaTitle: "Custom Website + AI for Charlotte Auto Shops | TSD Modernization Solutions",
    routeMetaDesc: "Custom website and AI tools for Charlotte auto repair, body shops, and tire stores — online quote requests, service catalogs, after-hours intake. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
    hero: {
      h1: "Charlotte auto shops. Half your bay is empty Tuesday morning.",
      h1Italic: "Fill it from your phone.",
      sub: "Custom website + AI tools for Charlotte auto repair, body shops, and tire stores. Online quote requests, service catalogs, after-hours intake. Built and shipped in 2-4 weeks.",
    },
    build: {
      title: "Here's what we'd ship for your shop.",
      sub: "Six deliverables, fixed scope, fixed price. Source code + GitHub repo are yours from day one — past August 31, your codebase has a Claude-powered co-pilot for fixes and updates.",
      bullets: [
        "Mobile-first site: services, fleet capabilities, ASE certifications",
        "Online quote-request form: photo upload + description, goes straight to your phone",
        "Service catalog with photos: brakes, alignment, transmissions — buyers know what you do before they call",
        "AI chat: \"do you do European cars?\", \"how long for an oil change?\" — 24/7 answers",
        "Google Business Profile sync so hours, reviews, and directions show on Google",
        "Source code + GitHub repo are yours from day one",
      ],
    },
  },

  restaurants: {
    slug: "restaurants",
    vertical: "Charlotte Restaurants",
    routeMetaTitle: "Custom Website + AI for Charlotte Restaurants | TSD Modernization Solutions",
    routeMetaDesc: "Custom website and AI tools for Charlotte restaurants, bakeries, and food trucks — reservations, online ordering, AI chat for menu and hours. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
    hero: {
      h1: "Charlotte restaurants. The phone keeps ringing through dinner service.",
      h1Italic: "Let the website take the order.",
      sub: "Custom website + AI tools for Charlotte restaurants, bakeries, and food trucks. Reservations, online ordering, AI chat for menu and hours. Built and shipped in 2-4 weeks.",
    },
    build: {
      title: "Here's what we'd ship for your restaurant.",
      sub: "Six deliverables, fixed scope, fixed price. Source code + GitHub repo are yours from day one — past August 31, your codebase has a Claude-powered co-pilot for fixes and updates.",
      bullets: [
        "Mobile-first site: full menu, hours, location, ordering link",
        "Reservations widget plugged into your system (OpenTable, Resy, Tock, or built-in form)",
        "Online ordering link to your existing platform (Toast, Square, DoorDash, ChowNow)",
        "AI chat: \"what's gluten-free?\", \"are you open Sunday brunch?\", \"do you do takeout?\" — 24/7 answers",
        "Google Business Profile + Yelp sync so reviews and hours show first",
        "Source code + GitHub repo are yours from day one",
      ],
    },
  },
};

/* Stable list of relationship slugs for routing + sitemap generation. */
export const RELATIONSHIP_SLUGS = Object.keys(RELATIONSHIPS);
