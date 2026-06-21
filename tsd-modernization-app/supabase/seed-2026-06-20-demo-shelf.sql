-- Park the 6 Gastonia Concierge demos (2026-06-20 research) on the sales shelf.
--
-- Run AFTER the app is deployed (the /demos/<slug> pages must exist). Each
-- prospect leads with the `concierge` product and its demo_site_url points at
-- the in-app demo page, so "Open demo" on /sales/demos opens the concierge.
--
-- Idempotent: each row is skipped if a prospect with that business_name exists.
-- demo_site_url uses the public www host (served via the marketing-site rewrite
-- to /demos/*). If that rewrite isn't live yet, swap the host for
-- https://tsd-modernization-solutions-uc71.vercel.app.
--
-- Ratings here are the internal sales-card figures (sourced per row). The public
-- demo pages deliberately publish NO rating. Bubbles & Bows rating is unverified
-- (left null); Cooper review_count is unverified (left null).

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Lewis Feed & Western Store',
  'https://lewisfeedandwesternstore.com/',
  'https://www.tsd-modernization.com/demos/lewis-feed-western-store',
  '(704) 861-1210', 'Gastonia', 'concierge', 'new', 4.7, 361,
  '44 years and a strong local reputation, but a dated WooCommerce shell with no posted hours or FAQ. Concierge answers feed, brand, boot, and hours questions instantly and routes prices/stock to a call.',
  'https://reviews.birdeye.com/lewis-feed-western-store-167792045866327',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Lewis Feed & Western Store');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Bubbles & Bows Tropical Pet Resort & Spa',
  'https://bubblesandbowsnc.com/',
  'https://www.tsd-modernization.com/demos/bubbles-and-bows-pet-resort',
  '(704) 866-9098', 'Gastonia', 'concierge', 'new', null, null,
  'Rich published boarding rates and policies trapped on a dated site with no online booking. Concierge answers check-in windows, rates, cash-only, and second-dog questions 24/7. (Google rating unverified.)',
  'https://bubblesandbowsnc.com/',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Bubbles & Bows Tropical Pet Resort & Spa');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Cooper Family Dentistry',
  'https://cooperfamilydentistry.org/',
  'https://www.tsd-modernization.com/demos/cooper-family-dentistry',
  '(704) 865-0490', 'Gastonia', 'concierge', 'new', 4.9, null,
  '4.9-star, family-owned since 1946, on an early-2010s template with no services or FAQ on the homepage. Concierge answers crowns/implants/whitening, kids, insurance, and hours.',
  'https://cooperfamilydentistry.org/',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Cooper Family Dentistry');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Miller''s Transmission Inc',
  'https://www.google.com/maps/search/Miller%27s+Transmission+Gastonia+NC',
  'https://www.tsd-modernization.com/demos/millers-transmission',
  '(704) 867-2570', 'Gastonia', 'concierge', 'new', 4.5, 200,
  '61-year transmission specialist (4.5, 200+ reviews) with no real website, only directory pages. Concierge owns their name online and routes rebuild/diagnosis/pricing to a call.',
  'https://reviews.birdeye.com/millers-transmission-inc-156072844657757',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Miller''s Transmission Inc');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Black''s Barbecue',
  'https://www.google.com/maps/search/Black%27s+Barbecue+Gastonia+NC',
  'https://www.tsd-modernization.com/demos/blacks-barbecue',
  '(704) 867-0941', 'Gastonia', 'concierge', 'new', 4.5, 244,
  'A 1957 carhop drive-in with a 7-decade reputation and zero owned site. Concierge answers menu, the slawburger, cash-only, and hours; a real site finally matches the legend.',
  'https://www.restaurantji.com/nc/gastonia/blacks-barbecue-/',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Black''s Barbecue');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Ewing Insurance Agency',
  'http://www.insuregaston.com/',
  'https://www.tsd-modernization.com/demos/ewing-insurance-agency',
  '(704) 861-0100', 'Gastonia', 'concierge', 'new', 4.9, 70,
  'Trusted independent agency on a dated bellsouth-era template. Concierge fields auto/home/commercial/workers-comp and quote-intent after hours and routes specifics to a call.',
  'https://agents.libertymutual.com/find-an-agent/state/north-carolina/gastonia/ewing-insurance-agency-inc_cl_3466557675',
  'gastonia-research-2026-06-20'
where not exists (select 1 from public.prospects where business_name = 'Ewing Insurance Agency');
