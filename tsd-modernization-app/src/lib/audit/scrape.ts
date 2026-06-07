import "server-only";
import * as cheerio from "cheerio";
import type { ScrapeResult } from "./types";
import { safeFetch, SsrfBlockedError, type SafeFetchResult } from "./safe-fetch";

const FETCH_TIMEOUT_MS = 8000;
// Cap the scraped body so a huge/slow response can't exhaust the 300s lambda.
const MAX_BODY_BYTES = 3_000_000;

async function countSitemapPages(origin: string): Promise<number | null> {
  try {
    const res = await safeFetch(`${origin}/sitemap.xml`, {
      timeoutMs: 4000,
      maxBytes: MAX_BODY_BYTES,
      maxRedirects: 3,
    });
    if (!res.ok) return null;
    const matches = res.body.match(/<loc>/g);
    return matches ? matches.length : null;
  } catch {
    return null;
  }
}

export async function scrapeWebsite(rawUrl: string): Promise<ScrapeResult> {
  const fetchedAt = new Date().toISOString();
  let url = rawUrl;
  try {
    const parsed = new URL(rawUrl);
    url = parsed.toString();
  } catch {
    return emptyResult(rawUrl, fetchedAt, "Invalid URL");
  }
  const origin = new URL(url).origin;
  const isHttps = url.startsWith("https://");

  let res: SafeFetchResult;
  try {
    res = await safeFetch(url, {
      timeoutMs: FETCH_TIMEOUT_MS,
      maxBytes: MAX_BODY_BYTES,
      maxRedirects: 5,
    });
  } catch (e) {
    // Keep the persisted error generic: it surfaces on the public status
    // endpoint, so don't turn it into an SSRF / internal-host oracle.
    const msg =
      e instanceof SsrfBlockedError
        ? "Could not fetch the site."
        : "Could not reach the site.";
    return emptyResult(url, fetchedAt, msg);
  }

  if (!res.ok) {
    return {
      ...emptyResult(url, fetchedAt, `HTTP ${res.status}`),
      status: res.status,
      has_https: isHttps,
    };
  }

  const html = res.body;
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;
  const description =
    $('meta[name="description"]').attr("content")?.trim() || null;
  const h1s = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const has_viewport_meta = $('meta[name="viewport"]').length > 0;
  const has_schema_org =
    $('script[type="application/ld+json"]').length > 0 ||
    $("[itemscope]").length > 0;
  const has_open_graph = $('meta[property^="og:"]').length > 0;
  const has_favicon =
    $('link[rel*="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0;

  let internal = 0;
  let external = 0;
  let originHost = "";
  try {
    originHost = new URL(url).host;
  } catch {
    originHost = "";
  }
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
      return;
    try {
      const linkUrl = new URL(href, url);
      if (linkUrl.host === originHost) internal++;
      else external++;
    } catch {
      // ignore unparseable links
    }
  });

  const images = $("img");
  const image_count = images.length;
  const images_with_alt = images.filter((_, el) => Boolean($(el).attr("alt"))).length;

  const bodyText = $("body").text();
  const has_phone_on_page = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(bodyText);
  const has_email_on_page = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
    bodyText
  );
  const ctaText = bodyText.toLowerCase();
  const has_book_or_quote_cta =
    /(book\s+(now|online|appointment))|get\s+(a\s+)?(quote|estimate)|schedule\s+(now|online)|call\s+today/.test(
      ctaText
    );
  const has_contact_link = $('a[href*="contact"]').length > 0;

  const sitemap_pages = await countSitemapPages(origin);

  return {
    fetched_at: fetchedAt,
    url,
    status: res.status,
    title,
    description,
    h1s: h1s.slice(0, 10),
    has_viewport_meta,
    has_schema_org,
    has_open_graph,
    has_favicon,
    internal_link_count: internal,
    external_link_count: external,
    image_count,
    images_with_alt,
    has_https: isHttps,
    has_contact_link,
    has_phone_on_page,
    has_email_on_page,
    has_book_or_quote_cta,
    sitemap_pages,
    fetch_error: null,
  };
}

function emptyResult(
  url: string,
  fetchedAt: string,
  err: string
): ScrapeResult {
  return {
    fetched_at: fetchedAt,
    url,
    status: 0,
    title: null,
    description: null,
    h1s: [],
    has_viewport_meta: false,
    has_schema_org: false,
    has_open_graph: false,
    has_favicon: false,
    internal_link_count: 0,
    external_link_count: 0,
    image_count: 0,
    images_with_alt: 0,
    has_https: url.startsWith("https://"),
    has_contact_link: false,
    has_phone_on_page: false,
    has_email_on_page: false,
    has_book_or_quote_cta: false,
    sitemap_pages: null,
    fetch_error: err,
  };
}
