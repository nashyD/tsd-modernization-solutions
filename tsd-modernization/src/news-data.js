/* News / Field Notes posts. Newest first.
   Add an object here to publish a post — routes, nav meta, and JSON-LD all
   read from this catalog, so a new entry auto-wires its /news/:slug page,
   <title>/<meta> for link previews, and BlogPosting schema.

   Keep claims public-safe: anonymized client references only (mirror the
   site's existing phrasing — "a Charlotte wholesale importer", "one local
   bakery", "a Carolina insurance agency") until a client signs off on being
   named publicly. */

export const POSTS = [
  {
    slug: "field-notes-001",
    title: "Field Notes #001 — Here's What We've Been Building",
    tag: "Field Notes",
    date: "June 19, 2026",
    dateISO: "2026-06-19",
    readMins: 3,
    excerpt:
      "An honest account of what we've shipped lately — an AI receptionist we run on our own phones, site assistants that won't make things up, and a free audit that found one local bakery $540 a month.",
    lead:
      "We started TSD Modernization Solutions on a simple bet: most local businesses are quietly leaking money — missed after-hours calls, slow quotes, software nobody remembers signing up for — and the fix is usually focused work, not a six-figure platform. Here's what we've been building toward that.",
    stats: [
      { value: "$540/mo", label: "wasted software we cut for one local bakery" },
      { value: "24/7", label: "an AI receptionist live on our own lines" },
      { value: "48 hrs", label: "from a free fit call to a fixed-price proposal" },
    ],
    sections: [
      {
        heading: "We answer our own phones with AI",
        paras: [
          "We run TSD Front Desk on our own company line before we sell it to anyone. It picks up 24/7, works out what the caller needs, books the slot, and texts us the summary. We didn't want to pitch a receptionist we hadn't lived with — so it has been answering our number first.",
        ],
      },
      {
        heading: "Assistants that won't make things up",
        paras: [
          "TSD Concierge answers a visitor's questions from the business's own catalog, documents, and policies — and links the source for every answer. When it doesn't know, it says so and hands off to a human. It can't invent a price or a spec. One is already running for a Charlotte wholesale importer, and you can try a live one on our site.",
        ],
      },
      {
        heading: "We find the leak before we pitch anything",
        paras: [
          "Every fit call opens with a free cost-cut audit: we read your real software and vendor bills and hand you a kill list — what to cancel, what to switch, and the dollars on each line — whether or not you hire us. At one local bakery, that was $540 a month. $6,480 a year.",
        ],
      },
      {
        heading: "We build your demo before you pay a dime",
        paras: [
          "The fastest way to show an owner what's possible is to build it on their own business. We've put up working demos for shops across Gastonia and the Charlotte corridor — a modern site, an assistant trained on their catalog, a booking flow — so the pitch is something you can click instead of a slide you have to imagine.",
        ],
      },
    ],
    closer:
      'That\'s the shape of it: build what pays for itself, prove it on our own business first, and show the receipts. More field notes soon — including the monthly "here\'s what it did" report we\'re rolling out for every client. If your business has a leak you can feel, the fit call is free.',
  },
];

export const getPost = (slug) => POSTS.find((p) => p.slug === slug);
