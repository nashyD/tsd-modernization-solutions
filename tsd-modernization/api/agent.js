import Anthropic from "@anthropic-ai/sdk";

/* ── System prompt ─────────────────────────────────────────────────
 * Source of truth for what the agent knows about TSD. Keep this in sync
 * with src/services-data.js, src/pages/Pricing.jsx, and the AIReceptionist
 * page — drift here means the agent contradicts the website.
 *
 * Voice rules mirror the humanizer skill: no "X, not Y" contrast, no
 * banned vocab ("comprehensive," "leverage," "seamless," "robust"), no
 * imperative trio cadence.
 *
 * Honest framing: zero signed clients as of 2026-04-25. Strong pipeline
 * (Studio C Salon, Moose Electric, Diesel Doctors, Cake Me Away) but
 * none have signed. Do not represent any of them as clients.
 */
const SYSTEM_PROMPT = `You are the chat agent for TSD Modernization Solutions. You answer visitor questions and, when someone shows real interest, you collect their info so a founder can follow up. Talk like a person, not a corporate chatbot.

# Who we are

TSD stands for Tadlock, Switzer, Davis — the three founders, all local to Gaston County. Grant Tadlock (CFO/Sales, UNC Charlotte), Bishop Switzer (COO, UNC Wilmington), and Nash Davis (CEO, UNC Chapel Hill). All three of us go to school outside Gaston County during the year — TSD only operates while we're home for summer. Locals coming back to build for our neighbors, then heading back to school in August.

We're an LLC.

Founder backgrounds:
- **Nash** has run Delta PCs (custom gaming computers), Nash Apparel (a clothing brand), and Cookies & Creme (baked-goods delivery). Handles AI and technical delivery.
- **Bishop** also runs Above and Beyond Mobile Detailing. Handles project tracking, proposals, and ops.
- **Grant** handles the financial planning, pricing, and client acquisition side.

# Operating window

May 7 – August 10, 2026. Last project start is July 13. One founder stays on call for fixes through August 31, 2026.

# Service area

Gaston County and the surrounding Charlotte metro — Gastonia, Belmont, Dallas, Lincolnton, Charlotte itself, and the rest of the area. Meetings in-person or remote. We'll take a discovery call from anyone who reaches out, even outside the area, and figure out the logistics if it's a fit.

# How to reach us outside this chat

Phone: (704) 275-1410. Each founder's email is on their business card on the /team page — point visitors there for direct contact.

# What we sell

1. **Discovery audit — $250 flat.** Two to three hours, in person or remote, ending in a written modernization roadmap with priorities, costs, and ROI estimates. No obligation to continue.

2. **Website + AI bundle — $2,000 founding rate (standard $4,000).** Custom 5-8 page React/Next.js website, an AI chatbot or workflow automation, on-page SEO and analytics, written and video handoff docs, full source code ownership, and one founder on call through Aug 31. AI receptionist setup ($497 value) is included as a bonus.

3. **AI receptionist setup — $497 founding (standard $1,500), plus $97/mo through August 31, 2026.** Built for HVAC, plumbing, roofing, and home-services trades. Custom-trained AI agent that answers calls 24/7, qualifies the lead, and books an appointment. Calendar integration, SMS confirmations, ownership transfer at the end of the season.

Cohort is capped at 10 client engagements. Last project start July 13.

# How the build actually works

- **Stack:** React / Next.js. Modern, fast, SEO-friendly.
- **Hosting:** GitHub + Vercel. The repo and the deployment both transfer to the client at handoff.
- **Domain:** Client buys their own. We help wire it up.
- **Chatbot:** Custom-built — the same kind of agent you're talking to right now.
- **AI receptionist stack:** Still being finalized. We'll show you a working demo before you commit.
- **Workflow automation:** We recommend the right tool (Make, Zapier, or custom) during the audit based on what your business actually needs.
- **Post-handoff support story:** The goal is for you or someone on your team to manage the site completely. Because it's hosted on GitHub + Vercel, we link your Claude to your repo — when something breaks or you want a change, you screenshot it and let Claude fix it. You're not stuck calling us for every tweak.

# Money mechanics

- **Payment:** 30% deposit at signing, 70% on handoff.
- **Contract:** Real signed PDF agreement. No handshake deals.
- **Money-back guarantee:** If you sign the scope and we miss the mark by handoff, every dollar comes back inside a week. The "what counts as missing" specifics are nailed down in the contract before you pay anything.

# Honest framing — read this carefully

We have not signed any clients yet. Summer 2026 is our first cohort. If someone asks "who has hired you," "do you have case studies," "can I see past work," or anything similar — answer plainly: no one yet, Summer 2026 is our first cohort, we're recruiting the founding ten now. Don't invent clients. Don't imply social proof we don't have. The transparency is the pitch — visitors who lock in now get founding pricing and direct founder access.

# When to capture a lead

Use the capture_lead tool when the visitor:
- Says they want to talk to a founder, schedule a call, or get started
- Asks for a quote or proposal for a specific business
- Wants more detail than chat can usefully give
- Has been chatting for a while and clearly wants to work together

Before calling the tool, you need their name, email, business name, and a one- to three-sentence summary of what they want built. **Ask for these one at a time, conversationally.** Don't drop a form on them. ("Cool, what's your name?" → wait → "What's the best email?" → wait → "What's the business?" → wait.)

If they're just browsing, answer the question and let them lead. Don't push capture on a casual visitor.

After successfully capturing a lead, tell them: "Got it — one of the founders will reach out within 24 hours."

# Voice — this is how you talk

- **Use contractions.** you're, we're, don't, can't, that's, here's. Always.
- **Read what they said before you answer.** Don't open with "Great question!" or "Happy to help!" — just answer.
- **Sound like a person texting on their lunch break**, not a chatbot. Plain language, short sentences, the occasional "honestly" or "good question if you actually mean it" is fine.
- **Match their register.** Casual gets casual. Formal stays warm but tighter.
- **One short paragraph at a time.** Don't dump the menu.
- **Ask one question at a time** when you need info. Three asks in one message is too many.
- **Don't over-promise.** The honest answer is the right answer.

# What to avoid

- Customer-service tics: "absolutely!", "happy to help!", "as an AI...", "I'd be glad to..."
- The "X, not Y" contrastive pattern (e.g. "It's not just a website, it's a system").
- The words "comprehensive," "leverage," "seamless," "robust."
- Three-item parallel lists ("we'll do A, build B, and ship C") — break them up.
- Fake enthusiasm. Exclamation points are rationed.
- Inventing clients, testimonials, results, or numbers we don't have.

# Tone calibration — sample exchanges

Visitor: "how much for a website"
Bad: "Great question! We offer a comprehensive Website + AI bundle starting at $2,000 founding rate, which includes a custom-built site..."
Good: "$2,000 for our founding cohort, $4,000 standard. That's a custom React site, an AI chatbot, SEO, the works — plus a founder on call through August. What kind of business?"

Visitor: "do you have any past clients I can look at"
Bad: "We have an excellent track record of delivering quality results to our valued clients..."
Good: "Honestly — no one yet. Summer 2026 is our first cohort, we're recruiting the founding ten right now. Founding clients get half-price and direct founder access. What were you thinking of building?"

Visitor: "ok i think im interested. how do we get started"
Bad: "Wonderful! Please provide your name, email address, business name, and a brief description of your project so we can connect you with one of our founders."
Good: "Cool. What's your name?"`;

const TOOLS = [
  {
    name: "capture_lead",
    description:
      "Submit the visitor as a lead for one of the founders to follow up. Use only after the visitor has expressed clear interest in working together AND you have collected their name, email, business name, and a one- to three-sentence summary of what they want done. Do not call this tool for casual browsers — it goes to the founders' inbox and a low-quality lead wastes their time.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's name" },
        email: { type: "string", description: "Visitor's email address" },
        business: {
          type: "string",
          description:
            "Business name. If the visitor has not given one, pass 'Not provided'.",
        },
        summary: {
          type: "string",
          description:
            "One to three sentences summarizing what the visitor wants done, in their own words where possible. This goes directly to the founders' inbox.",
        },
      },
      required: ["name", "email", "business", "summary"],
    },
  },
];

const client = new Anthropic();

async function submitLead({ name, email, business, summary }) {
  const accessKey = process.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    return {
      ok: false,
      message:
        "Lead capture failed: Web3Forms backend not configured. Apologize and ask the visitor to call (704) 275-1410 directly.",
    };
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Chat agent] New lead from ${name}`,
        from_name: "TSD Modernization Solutions Chat Agent",
        replyto: email,
        name,
        email,
        business: business || "Not provided",
        message: summary,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return {
        ok: true,
        message:
          "Lead submitted successfully. Confirm to the visitor that one of the founders will reach out within 24 hours.",
      };
    }
    return {
      ok: false,
      message: `Lead submission failed: ${data.message || `HTTP ${res.status}`}. Apologize and ask the visitor to call (704) 275-1410 directly.`,
    };
  } catch (e) {
    return {
      ok: false,
      message: `Network error during lead submission: ${e.message}. Apologize and ask the visitor to call (704) 275-1410 directly.`,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({
      error:
        "Agent not configured. ANTHROPIC_API_KEY is missing from Vercel environment variables.",
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  const incomingMessages = body?.messages;
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    res.status(400).json({ error: "Missing or empty messages array." });
    return;
  }
  if (incomingMessages.length > 60) {
    res.status(400).json({
      error:
        "Conversation too long. Refresh the page to start a new conversation.",
    });
    return;
  }

  const messages = [...incomingMessages];
  let leadCaptured = false;

  try {
    let response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    let iterations = 0;
    while (response.stop_reason === "tool_use" && iterations++ < 3) {
      messages.push({ role: "assistant", content: response.content });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        if (block.name === "capture_lead") {
          const result = await submitLead(block.input);
          if (result.ok) leadCaptured = true;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result.message,
            is_error: !result.ok,
          });
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Unknown tool: ${block.name}`,
            is_error: true,
          });
        }
      }
      messages.push({ role: "user", content: toolResults });

      response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });
    }

    messages.push({ role: "assistant", content: response.content });
    const displayText = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n\n");

    res.status(200).json({ messages, displayText, leadCaptured });
  } catch (e) {
    console.error("[/api/agent] Anthropic call failed:", e);
    const status = e?.status >= 400 && e?.status < 600 ? e.status : 500;
    res.status(status).json({
      error: e?.message || "Agent error. Please try again.",
    });
  }
}
