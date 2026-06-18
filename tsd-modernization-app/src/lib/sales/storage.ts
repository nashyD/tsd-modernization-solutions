import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const PROSPECT_ASSETS_BUCKET = "prospect-assets";

let ensured = false;

/**
 * Ensure the private `prospect-assets` bucket exists. Idempotent and cheap after
 * the first call (memoized per server instance). Lets the app self-provision the
 * bucket on first upload instead of requiring a manual Supabase dashboard step.
 * The bucket is PRIVATE — files are only ever served via short-lived signed URLs.
 */
export async function ensureProspectAssetsBucket(): Promise<void> {
  if (ensured) return;
  const sb = supabaseAdmin();
  const { data: existing } = await sb.storage.getBucket(PROSPECT_ASSETS_BUCKET);
  if (!existing) {
    const { error } = await sb.storage.createBucket(PROSPECT_ASSETS_BUCKET, {
      public: false,
      // Defense in depth alongside the server-side check in uploadAsset.
      fileSizeLimit: 15 * 1024 * 1024,
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "application/pdf",
      ],
    });
    // Ignore "already exists" races between concurrent uploads.
    if (error && !/exist/i.test(error.message)) {
      throw new Error(`Could not create storage bucket: ${error.message}`);
    }
  }
  ensured = true;
}
