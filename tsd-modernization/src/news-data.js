/* News / Field Notes posts. Newest first.
   Add an object here to publish a post — routes, nav meta, and JSON-LD all
   read from this catalog, so a new entry auto-wires its /news/:slug page,
   <title>/<meta> for link previews, and BlogPosting schema.

   Keep claims public-safe: anonymized client references only (mirror the
   site's existing phrasing — "a Charlotte wholesale importer", "one local
   bakery", "a Carolina insurance agency") until a client signs off on being
   named publicly.

   Voice: plainspoken and concrete. No em dashes, no "X, not Y" contrast
   construction, no buzzwords. Write like an operator telling another
   operator what shipped. */

export const POSTS = [
  {
    slug: "field-notes-001",
    title: "Field Notes #001: What we've been building",
    tag: "Field Notes",
    date: "June 19, 2026",
    dateISO: "2026-06-19",
    readMins: 3,
    excerpt:
      "A quick rundown of what we've shipped lately. An AI receptionist we run on our own phones, site assistants that won't make things up, and a free audit that found one local bakery $540 a month.",
    lead:
      "We started TSD on a simple bet. Most local businesses are quietly leaking money. A missed after-hours call here, a slow quote there, software nobody remembers paying for. The fix is usually a few days of focused work, and nobody needs a six-figure platform for it. Here's where that's landed so far.",
    stats: [
      { value: "$540/mo", label: "wasted software we cut for one local bakery" },
      { value: "24/7", label: "an AI receptionist live on our own lines" },
      { value: "48 hrs", label: "from a free fit call to a fixed-price proposal" },
    ],
    sections: [
      {
        heading: "We answer our own phones with AI",
        paras: [
          "We run TSD Front Desk on our own company line before we'll sell it to anyone. It picks up around the clock, works out what the caller needs, books the slot, and texts us the summary. We weren't going to pitch a receptionist we hadn't lived with ourselves, so it has been answering our number first.",
        ],
      },
      {
        heading: "Assistants that won't make things up",
        paras: [
          "TSD Concierge answers a visitor's questions straight from the business's own catalog, documents, and policies, and it links the source on every answer. When it doesn't know, it says so and passes you to a real person. It can't invent a price or a spec. One is already running for a Charlotte wholesale importer, and you can try a live one on our site.",
        ],
      },
      {
        heading: "We find the leak before we pitch anything",
        paras: [
          "Every fit call opens with a free cost-cut audit. We read your real software and vendor bills and hand you a kill list, with the dollar amount on every line and what to switch to. You keep it whether or not you hire us. At one local bakery, that list came to $540 a month, which is $6,480 a year.",
        ],
      },
      {
        heading: "We build your demo before you pay a dime",
        paras: [
          "The fastest way to show an owner what's possible is to build it on their own business. We've put up working demos for shops across Gastonia and the Charlotte area, with their real site, an assistant trained on their catalog, and a booking flow already standing. The pitch becomes something you can click instead of a slide you have to imagine.",
        ],
      },
    ],
    closer:
      "That's the pattern. Build what pays for itself, run it on our own business first, then show the numbers. More field notes soon, including the monthly \"here's what it did\" report we're rolling out for every client. If your business has a leak you can feel, the fit call is free.",
  },
];

export const getPost = (slug) => POSTS.find((p) => p.slug === slug);
