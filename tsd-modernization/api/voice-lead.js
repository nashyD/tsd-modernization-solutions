/* Vercel function — accepts lead submissions from the Pipecat voice
 * receptionist (Fly.io) and forwards them to Web3Forms.
 *
 * Why this exists: Web3Forms' free plan blocks server-side requests
 * from non-whitelisted IPs. Vercel's egress IPs are accepted, Fly's
 * are not. Rather than upgrade Web3Forms or chase egress whitelisting,
 * we proxy the voice agent's leads through this endpoint — the actual
 * Web3Forms POST runs from Vercel just like the chat agent does.
 *
 * Auth: shared secret in the x-voice-secret header. Set
 * VOICE_LEAD_SHARED_SECRET in both Vercel and Fly secrets to the same
 * value (any random string). Without it, anyone could spam fake voice
 * leads to the founders' inbox.
 *
 * Same Web3Forms inbox + key as the chat agent so leads land in one
 * place; subject is prefixed "[Voice receptionist]" so they can be
 * filtered separately.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const sharedSecret = process.env.VOICE_LEAD_SHARED_SECRET;
  const provided = req.headers["x-voice-secret"];
  if (!sharedSecret || provided !== sharedSecret) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const accessKey = process.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    return res.status(500).json({
      ok: false,
      message: "Lead capture not configured: Web3Forms key missing.",
    });
  }

  const { name, business, summary, caller_phone } = req.body || {};
  if (!name || !summary) {
    return res.status(400).json({
      ok: false,
      message: "Lead missing required fields (name, summary).",
    });
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Voice receptionist] New lead from ${name}`,
        from_name: "TSD Modernization Solutions Voice Receptionist",
        name,
        email: "(via voice — see phone number below)",
        business: business || "Not provided",
        phone: caller_phone || "Not captured",
        message: summary,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success) {
      return res.status(200).json({
        ok: true,
        message:
          "Lead submitted. Tell the caller a founder will reach out within twenty-four hours, and ask if there's anything else they need.",
      });
    }
    return res.status(502).json({
      ok: false,
      message: `Lead submission failed (${data.message || `HTTP ${response.status}`}). Apologize and ask the caller to call back during business hours.`,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: `Network error submitting lead: ${e.message}. Apologize and ask the caller to call back during business hours.`,
    });
  }
}
