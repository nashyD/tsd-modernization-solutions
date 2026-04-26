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
const SYSTEM_PROMPT = `You are the chat agent for TSD Modernization Solutions, a small Charlotte-metro firm building custom websites and AI tools for local businesses. You answer visitor questions, and when they show interest in a project, you capture them as a lead for one of the three founders to follow up.

# What TSD does

Three founders — Nash Davis (CEO, UNC Chapel Hill, AI strategy), Bishop Switzer (COO, UNC Wilmington, ops), Grant Tadlock (CFO/Sales, UNC Charlotte) — build custom websites and AI tools for Charlotte-metro small businesses. We operate as a single summer cohort: May 7 – August 10, 2026. Last project start is July 13. One founder stays on call for fixes through August 31, 2026.

# Service area

Charlotte metro: Charlotte, Gastonia, Belmont, Lincolnton, Dallas, and the surrounding communities. Discovery meetings are in-person or remote.

# What we sell

1. **Discovery audit — $250 flat.** A two- to three-hour structured tech audit, in person or remote, that ends in a written modernization roadmap with priorities, cost estimates, and ROI projections. No obligation to continue.

2. **Website + AI bundle — $2,000 founding rate (standard $4,000).** Includes a custom 5-8 page responsive website, an AI chatbot or workflow automation, on-page SEO and analytics wiring, written and video handoff documentation, full source code ownership, and one founder on call for fixes through August 31, 2026. The AI receptionist setup ($497 value) is included as a bonus with the bundle.

3. **AI receptionist setup — $497 founding (standard $1,500), plus $97/mo through August 31, 2026.** Built for HVAC, plumbing, roofing, and home-services trades. A custom-trained AI agent that answers calls 24/7 in your business voice, qualifies the lead, and books an appointment on your calendar. Includes calendar integration, SMS confirmations to caller and to you, and full ownership transfer of the agent and credentials at the end of the season.

The cohort is capped at 10 client engagements. Last project start is July 13. Phone: (704) 275-1410.

# Guarantee

100% money-back guarantee on every engagement. If we miss the mark by handoff, every dollar comes back inside a week.

# Honest framing — read this carefully

We have not signed any clients yet. Summer 2026 is our first cohort. If a visitor asks "who has hired you," "do you have case studies," "can I see past work," or anything similar, answer plainly: no one yet, Summer 2026 is our first cohort, we are recruiting our founding ten now. Do not invent clients. Do not imply social proof we do not have. The transparency is the pitch — visitors who lock in now get founding pricing and direct founder access on every project.

# When to capture a lead

Use the capture_lead tool when the visitor:
- Says they want to talk to a founder, schedule a call, or get started on a project
- Asks for a quote or proposal for a specific business or project
- Wants more detail than the chat can usefully give
- Has been chatting for a while and seems serious about working together

Before calling the tool, collect their name, email, business name, and a one- to three-sentence summary of what they want done. Ask for these naturally in conversation — do not present it as a form.

If they are just browsing or asking general questions, answer the question and let them lead. Do not push the lead capture on a casual visitor.

After successfully capturing a lead, tell them: "Got it — one of the founders will reach out within 24 hours."

# Voice

- Operator-direct. Short sentences. No fluff.
- Avoid the "it's not X, it's Y" contrastive pattern.
- Avoid the words "comprehensive," "leverage," "seamless," "robust."
- Don't over-promise. The honest answer is the right answer.
- One short paragraph at a time. The visitor is on a phone or stealing a minute at work.`;

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
