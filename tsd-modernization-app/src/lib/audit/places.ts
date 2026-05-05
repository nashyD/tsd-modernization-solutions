import "server-only";
import { env } from "@/lib/env";
import type { PlacesResult } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";

interface PlacesV1FindResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    regularOpeningHours?: unknown;
    photos?: Array<unknown>;
    businessStatus?: string;
  }>;
}

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.regularOpeningHours",
  "places.photos",
  "places.businessStatus",
].join(",");

export async function lookupPlace(
  businessName: string,
  city: string
): Promise<PlacesResult> {
  const e = env();
  const query = `${businessName} ${city || ""}`.trim();
  try {
    const res = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": e.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
    });
    if (!res.ok) {
      return notFound(`Places API ${res.status}: ${await res.text().catch(() => "")}`);
    }
    const data = (await res.json()) as PlacesV1FindResponse;
    const place = data.places?.[0];
    if (!place || !place.id) return notFound(null);

    return {
      found: true,
      place_id: place.id,
      name: place.displayName?.text ?? null,
      rating: typeof place.rating === "number" ? place.rating : null,
      user_ratings_total:
        typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      formatted_address: place.formattedAddress ?? null,
      formatted_phone_number:
        place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null,
      website: place.websiteUri ?? null,
      hours_known: Boolean(place.regularOpeningHours),
      photo_count: place.photos?.length ?? 0,
      business_status: place.businessStatus ?? null,
      fetch_error: null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "places fetch failed";
    return notFound(msg);
  }
}

function notFound(err: string | null): PlacesResult {
  return {
    found: false,
    place_id: null,
    name: null,
    rating: null,
    user_ratings_total: null,
    formatted_address: null,
    formatted_phone_number: null,
    website: null,
    hours_known: false,
    photo_count: 0,
    business_status: null,
    fetch_error: err,
  };
}
