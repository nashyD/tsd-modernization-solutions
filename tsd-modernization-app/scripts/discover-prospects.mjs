/**
 * Gaston County prospect discovery harvester — Google Places API (New).
 *
 * Pulls established, well-reviewed, independent businesses across Gaston County,
 * scores them against TSD's ICP, tags each with the product to LEAD the pitch
 * with, and stages them in `prospect_candidates` for review on /sales/candidates.
 *
 * ICP gate: OPERATIONAL · rating >= 4.0 · >= 40 reviews · independent (not a
 * national chain/franchise — keyword denylist + brand-frequency).
 * Product mapping: no website -> Website; else by category —
 * appointment -> Booking Bridge, catalog/retail -> Concierge, everything else
 * (phone/intake-driven) -> AI Receptionist. Website quality for sites-present is
 * category-inferred for now; a later pass can crawl each site to confirm.
 *
 * Run (needs the Vercel-only keys locally — e.g. `vercel env pull .env.local`
 * from the app dir, which pulls GOOGLE_PLACES_API_KEY + Supabase keys):
 *   node --env-file=.env.local scripts/discover-prospects.mjs
 * or pass them inline:
 *   GOOGLE_PLACES_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/discover-prospects.mjs
 *
 * DRY=1 prints results without writing. Each search call is billed (~$32/1k Pro
 * Text Search); a full sweep is ~250-400 calls. Already-staged or already-promoted
 * businesses (matched on place_id) are skipped.
 */

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
).replace(/\/+$/, "");
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !!process.env.DRY;

if (!KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY.");
  process.exit(1);
}
if (!DRY && (!SUPABASE_URL || !SERVICE)) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (or set DRY=1 to preview).",
  );
  process.exit(1);
}

const CITIES = [
  "Gastonia",
  "Belmont",
  "Mount Holly",
  "Cramerton",
  "Stanley",
  "Dallas",
  "Bessemer City",
  "Lowell",
  "McAdenville",
  "High Shoals",
  "Cherryville",
];

// Vertical-agnostic: customer-facing local businesses likely to have cash AND a
// web/AI gap. Trim or extend freely — each entry is one Places text query/city.
const CATEGORIES = [
  "restaurants",
  "hair salons",
  "day spas",
  "barber shops",
  "nail salons",
  "dentists",
  "orthodontists",
  "medical clinics",
  "veterinarians",
  "chiropractors",
  "optometrists",
  "auto repair shops",
  "tire shops",
  "HVAC companies",
  "plumbers",
  "electricians",
  "roofing companies",
  "landscaping companies",
  "law firms",
  "accounting firms",
  "insurance agencies",
  "real estate agencies",
  "furniture stores",
  "jewelry stores",
  "garden centers",
  "fitness studios",
];

const MIN_RATING = 4.0;
const MIN_REVIEWS = 40;

// Obvious national chains / franchises to drop (brand-frequency catches the rest).
const CHAIN_RE =
  /\b(mcdonald|burger king|wendy|subway|taco bell|domino|pizza hut|papa john|kfc|chick-fil-a|bojangles|hardee|arby|sonic|dunkin|starbucks|chipotle|zaxby|cook ?out|walmart|target|lowe'?s|home depot|cvs|walgreens|rite aid|dollar (general|tree)|family dollar|autozone|o'?reilly|advance auto|firestone|jiffy lube|valvoline|great clips|sport clips|supercuts|aspen dental|jackson hewitt|h&r block|state farm|allstate|edward jones|planet fitness|anytime fitness|food lion|harris teeter|ingles|aldi|circle k)\b/i;

const APPOINTMENT = new Set([
  "dentist",
  "dental_clinic",
  "doctor",
  "medical_clinic",
  "beauty_salon",
  "hair_salon",
  "hair_care",
  "spa",
  "nail_salon",
  "barber_shop",
  "physiotherapist",
  "chiropractor",
  "veterinary_care",
  "skin_care_clinic",
  "gym",
  "fitness_center",
  "yoga_studio",
  "wellness_center",
]);
const CATALOG = new Set([
  "furniture_store",
  "home_goods_store",
  "jewelry_store",
  "clothing_store",
  "shoe_store",
  "hardware_store",
  "store",
  "supermarket",
  "grocery_store",
  "garden_center",
  "book_store",
  "gift_shop",
  "florist",
  "bicycle_store",
  "sporting_goods_store",
  "electronics_store",
  "wholesaler",
]);

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.businessStatus",
  "places.primaryType",
  "places.priceLevel",
  "nextPageToken",
].join(",");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(textQuery) {
  const out = [];
  let pageToken = null;
  for (let page = 0; page < 3; page++) {
    const body = pageToken ? { textQuery, pageToken } : { textQuery };
    let resp;
    try {
      resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error(`  fetch error: ${e.message}`);
      break;
    }
    if (!resp.ok) {
      console.error(`  Places ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
      break;
    }
    const data = await resp.json();
    for (const p of data.places || []) out.push(p);
    pageToken = data.nextPageToken;
    if (!pageToken) break;
    await sleep(2000); // let the page token activate
  }
  return out;
}

function mapProduct(p) {
  if (!p.websiteUri) {
    return {
      product: "website",
      gap: "No website found on Google — reputation but invisible online.",
    };
  }
  const t = p.primaryType || "";
  if (APPOINTMENT.has(t)) {
    return {
      product: "booking_bridge",
      gap: "Has a site; appointment business — likely phone-only booking (verify).",
    };
  }
  if (CATALOG.has(t)) {
    return {
      product: "concierge",
      gap: "Has a site; catalog/retail — assistant could field product questions (verify).",
    };
  }
  return {
    product: "front_desk",
    gap: "Has a site; phone-driven — likely misses calls (verify).",
  };
}

function fitScore(p, noWebsite) {
  const base = (p.rating || 0) * Math.log10((p.userRatingCount || 0) + 1) * 10;
  return Math.round((base + (noWebsite ? 15 : 0)) * 100) / 100;
}

const norm = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

async function existingPlaceIds() {
  const ids = new Set();
  if (DRY) return ids;
  for (const table of ["prospects", "prospect_candidates"]) {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=place_id`, {
      headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` },
    });
    if (resp.ok) {
      for (const row of await resp.json()) if (row.place_id) ids.add(row.place_id);
    } else {
      console.error(`  warn: could not read ${table} place_ids (${resp.status})`);
    }
  }
  return ids;
}

async function main() {
  console.log(
    `Harvesting Gaston County · ${CATEGORIES.length} categories × ${CITIES.length} cities…`,
  );
  const byId = new Map();
  const nameCount = new Map();
  for (const city of CITIES) {
    for (const cat of CATEGORIES) {
      const found = await search(`${cat} in ${city}, North Carolina`);
      for (const p of found) {
        const id = p.id;
        const name = p.displayName?.text || "";
        if (!id || !name || byId.has(id)) continue;
        byId.set(id, p);
        const k = norm(name);
        nameCount.set(k, (nameCount.get(k) || 0) + 1);
      }
      await sleep(200);
    }
    console.log(`  ${city} done · unique so far: ${byId.size}`);
  }

  const skip = await existingPlaceIds();
  const rows = [];
  let gated = 0;
  let chains = 0;
  let skipped = 0;
  for (const p of byId.values()) {
    if (skip.has(p.id)) {
      skipped++;
      continue;
    }
    const name = p.displayName?.text || "";
    if (p.businessStatus && p.businessStatus !== "OPERATIONAL") {
      gated++;
      continue;
    }
    if ((p.rating || 0) < MIN_RATING || (p.userRatingCount || 0) < MIN_REVIEWS) {
      gated++;
      continue;
    }
    if (CHAIN_RE.test(name) || (nameCount.get(norm(name)) || 0) >= 3) {
      chains++;
      continue;
    }
    const noWebsite = !p.websiteUri;
    const { product, gap } = mapProduct(p);
    const city =
      (p.formattedAddress || "").match(/,\s*([^,]+),\s*NC/i)?.[1]?.trim() || null;
    rows.push({
      place_id: p.id,
      business_name: name,
      address: p.formattedAddress || null,
      city,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      website: p.websiteUri || null,
      phone: p.nationalPhoneNumber || null,
      rating: p.rating ?? null,
      review_count: p.userRatingCount ?? null,
      price_level: p.priceLevel || null,
      primary_type: p.primaryType || null,
      primary_product: product,
      gap_summary: gap,
      fit_score: fitScore(p, noWebsite),
      signals: {
        noWebsite,
        primaryType: p.primaryType || null,
        priceLevel: p.priceLevel || null,
      },
    });
  }
  rows.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0));

  console.log(
    `\nUnique: ${byId.size} · gated out: ${gated} · chains dropped: ${chains} · already known: ${skipped} · NEW candidates: ${rows.length}`,
  );
  const byProduct = rows.reduce((m, r) => {
    m[r.primary_product] = (m[r.primary_product] || 0) + 1;
    return m;
  }, {});
  console.log("By product:", byProduct);
  console.log("\nTop 25 by fit:");
  for (const r of rows.slice(0, 25)) {
    console.log(
      `  [${r.fit_score}] ${r.business_name} (${r.city || "?"}) · ${r.rating || "?"}★/${r.review_count || "?"} → ${r.primary_product}${r.website ? "" : " · NO SITE"}`,
    );
  }

  if (DRY) {
    console.log("\nDRY run — nothing written.");
    return;
  }
  if (rows.length === 0) {
    console.log("\nNothing new to write.");
    return;
  }

  let written = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/prospect_candidates?on_conflict=place_id`,
      {
        method: "POST",
        headers: {
          apikey: SERVICE,
          Authorization: `Bearer ${SERVICE}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=representation",
        },
        body: JSON.stringify(chunk),
      },
    );
    if (!resp.ok) {
      console.error(`Supabase ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
      process.exit(1);
    }
    written += (await resp.json()).length;
  }
  console.log(`\nDone. Wrote ${written} candidates → review at /sales/candidates.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
