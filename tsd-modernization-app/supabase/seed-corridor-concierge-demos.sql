-- Park the 5 Gaston–Mecklenburg corridor Concierge demos on the sales shelf.
--
-- Run AFTER this app is deployed (the /demos/<slug> pages must exist). Each
-- prospect leads with the `concierge` product and its demo_site_url points at
-- the in-app demo page, so "Open demo" on /sales/demos opens the concierge.
--
-- Idempotent: each row is skipped if a prospect with that business_name exists.
-- demo_site_url uses the public www host (served via the marketing-site rewrite
-- to /demos/*). If you haven't added that rewrite yet, swap the host for
-- https://tsd-modernization-solutions-uc71.vercel.app.

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Bishop Tire & Auto Service',
  'https://www.google.com/maps/search/Bishop+Tire+%26+Auto+Service+Mount+Holly+NC',
  'https://www.tsd-modernization.com/demos/bishop-tire-auto-service',
  '(704) 827-5875', 'Mount Holly', 'concierge', 'new', 4.7, 230,
  '230+ five-star reviews pointing at a dead, parked website. Concierge answers tire-size, oil-change, hours, alignment, and NC-inspection questions instantly.',
  'https://www.google.com/maps/search/Bishop+Tire+%26+Auto+Service+Mount+Holly+NC',
  'corridor-research-2026-06-17'
where not exists (select 1 from public.prospects where business_name = 'Bishop Tire & Auto Service');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Steele Creek Animal Hospital',
  'https://keepingpetshealthy.com',
  'https://www.tsd-modernization.com/demos/steele-creek-animal-hospital',
  '(704) 588-4400', 'Charlotte (Steele Creek)', 'concierge', 'new', 4.6, 447,
  'High volume across a huge service menu, but phone-only: no online booking, FAQ, or pricing. Concierge handles boarding-vaccine, rehab, cost, and availability questions 24/7.',
  'https://keepingpetshealthy.com',
  'corridor-research-2026-06-17'
where not exists (select 1 from public.prospects where business_name = 'Steele Creek Animal Hospital');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Skillet Southern Bistro',
  'https://www.google.com/maps/search/Skillet+Southern+Bistro+Cramerton+NC',
  'https://www.tsd-modernization.com/demos/skillet-southern-bistro',
  '(704) 915-8399', 'Cramerton', 'concierge', 'new', 4.8, null,
  'No website at all; hours and menu are scattered across Yelp/Tripadvisor. Concierge answers "open tonight?" and "what''s on the menu?" so the chef can run service.',
  'https://www.google.com/maps/search/Skillet+Southern+Bistro+Cramerton+NC',
  'corridor-research-2026-06-17'
where not exists (select 1 from public.prospects where business_name = 'Skillet Southern Bistro');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Native Air',
  'https://nativeairandheat.com',
  'https://www.tsd-modernization.com/demos/native-air-lowell',
  '(704) 312-8589', 'Lowell', 'concierge', 'new', 4.9, 119,
  'Site promises "24/7" but the Schedule button is broken and there is no FAQ. Concierge makes the promise real and captures after-hours no-heat/no-AC leads with service area, brands, and financing.',
  'https://nativeairandheat.com',
  'corridor-research-2026-06-17'
where not exists (select 1 from public.prospects where business_name = 'Native Air');

insert into public.prospects
  (business_name, business_url, demo_site_url, phone, city, primary_product,
   status, rating, review_count, gap_summary, source_url, discovery_source)
select
  'Claws & Paws Inn',
  'https://www.google.com/maps/search/Claws+%26+Paws+Inn+Belmont+NC',
  'https://www.tsd-modernization.com/demos/claws-and-paws-inn',
  '(704) 822-1966', 'Belmont', 'concierge', 'new', 4.6, 130,
  'No website; vaccine rules, drop-off windows, and weekend availability live on Facebook. Concierge answers every routine booking question and captures the after-hours leads.',
  'https://www.google.com/maps/search/Claws+%26+Paws+Inn+Belmont+NC',
  'corridor-research-2026-06-17'
where not exists (select 1 from public.prospects where business_name = 'Claws & Paws Inn');
