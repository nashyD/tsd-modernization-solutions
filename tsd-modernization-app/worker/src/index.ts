import Fastify from "fastify";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";
import Anthropic from "@anthropic-ai/sdk";

const env = z
  .object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),
    WORKER_SECRET: z.string().min(16),
    PORT: z.string().default("8080"),
  })
  .parse(process.env);

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const RunPayload = z.object({
  auditId: z.string().uuid(),
  clientId: z.string().uuid(),
  businessName: z.string(),
  url: z.string().url(),
});

const app = Fastify({ logger: true });

app.get("/health", async () => ({ ok: true }));

app.post("/run-audit", async (req, reply) => {
  const secret = req.headers["x-worker-secret"];
  if (secret !== env.WORKER_SECRET) {
    return reply.code(401).send({ error: "unauthorized" });
  }
  const body = RunPayload.parse(req.body);

  // Kick off async; respond fast so the cron route doesn't block on us.
  void runMonthlyAudit(body).catch((err) => {
    app.log.error({ err, auditId: body.auditId }, "monthly audit failed");
  });
  return reply.send({ accepted: true });
});

async function runMonthlyAudit(p: z.infer<typeof RunPayload>) {
  await sb.from("audits").update({ status: "scraping" }).eq("id", p.auditId);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 30_000 });
    const screenshot = await page.screenshot({ fullPage: true });

    // Upload to Supabase Storage. Bucket "audit-screenshots" must exist.
    const path = `${p.clientId}/${new Date().toISOString().slice(0, 10)}.png`;
    await sb.storage
      .from("audit-screenshots")
      .upload(path, screenshot, { contentType: "image/png", upsert: true });

    const html = await page.content();
    const title = await page.title();
    const rawData = {
      url: p.url,
      title,
      screenshot_path: path,
      html_size: html.length,
      captured_at: new Date().toISOString(),
    };

    await sb
      .from("audits")
      .update({ status: "synthesizing", raw_data: rawData })
      .eq("id", p.auditId);

    const message = await anthropic.messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Snapshot audit for ${p.businessName} (${p.url}). Page title: ${title}. HTML size: ${html.length} bytes. Produce a JSON object with {"presence_score": int 0-100, "pillar_scores": {website,google,reviews,trust,conversion} ints 0-100, "gaps": [{title, severity, evidence, impact}], "tsd_services": [{service, rationale}], "recommended_package": one of discovery_audit/website_ai_bundle/founding_partnership, "one_line_summary": string}. Return JSON only.`,
        },
      ],
    });
    const text = message.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("");
    const json = JSON.parse(text.replace(/^```json\s*|```$/g, ""));

    await sb
      .from("audits")
      .update({
        status: "ready",
        scores: json,
        report_md: `Monthly snapshot for ${p.businessName} captured ${new Date().toISOString().slice(0, 10)}.`,
      })
      .eq("id", p.auditId);
  } finally {
    await browser.close();
  }
}

app.listen({ port: Number(env.PORT), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`worker listening on ${address}`);
});
