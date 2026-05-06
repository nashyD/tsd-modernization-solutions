import { z } from "zod";

export const AuditFormSchema = z.object({
  business_name: z.string().min(2, "Business name is too short.").max(120).trim(),
  business_url: z
    .string()
    .min(1, "Website URL is required.")
    .transform((v) => (v.startsWith("http") ? v : `https://${v}`))
    .pipe(z.string().url("Enter a valid website URL.")),
  email: z.string().email("Enter a valid email address.").trim(),
  phone: z
    .string()
    .min(7, "Phone number is too short.")
    .max(30)
    .trim(),
  city: z.string().max(80).trim().optional().default(""),
});
export type AuditFormInput = z.infer<typeof AuditFormSchema>;

export interface ScrapeResult {
  fetched_at: string;
  url: string;
  status: number;
  title: string | null;
  description: string | null;
  h1s: string[];
  has_viewport_meta: boolean;
  has_schema_org: boolean;
  has_open_graph: boolean;
  has_favicon: boolean;
  internal_link_count: number;
  external_link_count: number;
  image_count: number;
  images_with_alt: number;
  has_https: boolean;
  has_contact_link: boolean;
  has_phone_on_page: boolean;
  has_email_on_page: boolean;
  has_book_or_quote_cta: boolean;
  sitemap_pages: number | null;
  fetch_error: string | null;
}

export interface PlacesResult {
  found: boolean;
  place_id: string | null;
  name: string | null;
  rating: number | null;
  user_ratings_total: number | null;
  formatted_address: string | null;
  formatted_phone_number: string | null;
  website: string | null;
  hours_known: boolean;
  photo_count: number;
  business_status: string | null;
  fetch_error: string | null;
}

export interface RawAuditData {
  scrape: ScrapeResult;
  places: PlacesResult;
  input: AuditFormInput;
}

export const AuditScoresSchema = z.object({
  presence_score: z.number().int().min(0).max(100),
  pillar_scores: z.object({
    website: z.number().int().min(0).max(100),
    google: z.number().int().min(0).max(100),
    reviews: z.number().int().min(0).max(100),
    trust: z.number().int().min(0).max(100),
    conversion: z.number().int().min(0).max(100),
  }),
  gaps: z
    .array(
      z.object({
        title: z.string(),
        severity: z.enum(["critical", "high", "medium", "low"]),
        evidence: z.string().optional().default(""),
        impact: z.string().optional().default(""),
      }).passthrough()
    )
    .min(1)
    .max(20),
  tsd_services: z
    .array(
      z.object({
        service: z.enum([
          "website_rebuild",
          "ai_chatbot",
          "ai_receptionist",
          "automation",
          "seo_local",
          "review_management",
          "audit_only",
        ]),
        rationale: z.string().optional().default(""),
      }).passthrough()
    )
    .max(8),
  recommended_package: z.enum([
    "discovery_audit",
    "website_ai_bundle",
    "founding_partnership",
  ]),
  one_line_summary: z.string().min(10).max(400),
});
export type AuditScores = z.infer<typeof AuditScoresSchema>;

export const SynthesisOutputSchema = z.object({
  scores: AuditScoresSchema,
  report_md: z.string().min(200),
});
export type SynthesisOutput = z.infer<typeof SynthesisOutputSchema>;
