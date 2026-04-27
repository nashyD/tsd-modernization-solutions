/* Trade-specific landing page content. Each entry is the destination URL
   for its own ad set and cold-outreach template (per the v2 trades-wedge
   checklist — "each page is the destination URL, never the homepage").
   The shared TradePage.jsx template renders these into the Hero + Math
   sections; the Flow / Offer / ClosingCTA sections are identical across
   trades and live in the template.

   When adding a fourth trade (garage doors, roofing, etc.), drop a new
   key here, register the route in routes.jsx, and add the ROUTE_META
   entry in Layout.jsx. The template handles the rest. */

export const TRADES = {
  hvac: {
    slug: "hvac",
    vertical: "Charlotte HVAC",
    routeMetaTitle: "AI Receptionist for Charlotte HVAC Contractors | TSD Modernization Solutions",
    routeMetaDesc: "Custom AI receptionist for Charlotte HVAC contractors — books the after-hours emergency call so it doesn't go to a competitor by morning. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
    hero: {
      h1: "When it hits 95°, the phone rings off the hook.",
      h1Italic: "Don't lose the call.",
      sub: "AI receptionist for Charlotte HVAC contractors. Books emergency calls 24/7 — AC failures, weekend furnace breakdowns, storm-damaged units. $497 once, then the agent transfers to you on August 31.",
    },
    math: {
      title: "$700–$1,000 per missed call. June through August, that compounds.",
      body: "Industry data puts after-hours missed-call rates above 30% for service trades. For HVAC, the average emergency ticket runs $700 to $1,000 — a Saturday night AC failure becomes a Sunday morning quote with whoever picked up first. At one missed call per night across a peak summer (June 1 to August 31), even a 30% miss rate is $60,000 to $90,000 of revenue going to a competitor. The AI receptionist captures every after-hours call, qualifies the emergency, and books the slot before the customer dials the next listing.",
    },
  },

  electricians: {
    slug: "electricians",
    vertical: "Charlotte Electricians",
    routeMetaTitle: "AI Receptionist for Charlotte Electrical Contractors | TSD Modernization Solutions",
    routeMetaDesc: "Custom AI receptionist for Charlotte electricians — captures emergency rewires, panel failures, and after-hours service calls so the on-call rotation doesn't break. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
    hero: {
      h1: "The on-call rotation runs out. The phone doesn't.",
      h1Italic: "Your AI takes the call.",
      sub: "AI receptionist for Charlotte electrical contractors. Captures emergency rewires, panel failures, and after-hours service calls so your foreman can sleep. $497 once, then the agent transfers to you on August 31.",
    },
    math: {
      title: "Emergency rewires don't wait. Voicemail loses the job.",
      body: "An electrician who answers at 11pm burns out by Wednesday. The one whose phone rolls to voicemail loses the call — a panel failure or emergency rewire needs an electrician now, not a callback Monday morning. The on-call rotation breaks every weekend; the AI receptionist takes the call, qualifies the emergency, captures the address and urgency, and texts your foreman the summary. Your foreman decides whether to roll the truck — and the customer gets a confirmation either way, so the call doesn't dial the next listing.",
    },
  },

  plumbers: {
    slug: "plumbers",
    vertical: "Charlotte Plumbers",
    routeMetaTitle: "AI Receptionist for Charlotte Plumbers | TSD Modernization Solutions",
    routeMetaDesc: "Custom AI receptionist for Charlotte plumbers — captures weekend water-heater failures, burst pipes, and no-hot-water Sunday mornings, then books the truck. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
    hero: {
      h1: "The burst pipe at 2am pays for the week.",
      h1Italic: "Book the truck before the call drops.",
      sub: "AI receptionist for Charlotte plumbers. Captures weekend emergencies — water-heater failures, burst pipes, no-hot-water Sunday mornings — and books the truck. $497 once, then the agent transfers to you on August 31.",
    },
    math: {
      title: "Weekend water failures are your highest-margin jobs.",
      body: "Water heaters fail Friday afternoon. Pipes burst Saturday night. The plumber who answers Sunday morning at 7am charges weekend rates and books the truck. The one whose phone goes to voicemail loses the job — and usually loses the customer for the next emergency too. The AI receptionist captures every weekend call, qualifies the urgency (no hot water vs. flooding basement), and books the slot from your calendar. You spend Sunday with your kids; the AI books your Monday morning.",
    },
  },
};

/* Stable list of trade slugs for routing + sitemap generation. */
export const TRADE_SLUGS = Object.keys(TRADES);
