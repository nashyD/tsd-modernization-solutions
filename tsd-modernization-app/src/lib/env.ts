import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),
  GOOGLE_PLACES_API_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  INTERNAL_API_SECRET: z.string().min(16),
  VERCEL_API_TOKEN: z.string().min(1).optional(),
  WORKER_URL: z.string().url().optional(),
  WORKER_SECRET: z.string().min(1).optional(),
  // Square (sales-dashboard deposits). Sandbox until go-live; flip SQUARE_ENV to "production".
  SQUARE_ACCESS_TOKEN: z.string().min(1).optional(),
  SQUARE_LOCATION_ID: z.string().min(1).optional(),
  SQUARE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  SQUARE_WEBHOOK_SIGNATURE_KEY: z.string().min(1).optional(),
  // Optional: exact notification URL registered in Square, if it isn't just
  // NEXT_PUBLIC_SITE_URL + /api/square/webhook (the verifier also auto-tries the
  // www<->apex variant, so this is only needed for a fully different host).
  SQUARE_WEBHOOK_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function env(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid or missing environment variables:\n${issues}\nSee .env.example for the full list.`
    );
  }
  cached = parsed.data;
  return cached;
}
