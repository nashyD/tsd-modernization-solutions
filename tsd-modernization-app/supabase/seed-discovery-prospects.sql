-- One-time seed: 10 Gaston County prospects from the 2026-06-06 web-research pass,
-- each tagged with the product to LEAD the pitch with (primary_product).
-- Run AFTER 0007_prospect_discovery.sql.
--
-- Data is web-researched, not Google Places — review counts are approximate and
-- a few Google-specific counts are unconfirmed (left NULL; verify on Maps).
-- Each insert is guarded by NOT EXISTS on business_name, so re-running is safe.
--
-- selected_services uses the ESTIMATOR's ids (frontDesk/booking), which differ
-- from primary_product's ids (front_desk/booking_bridge). Mapping:
--   website -> "website" | front_desk -> "frontDesk"
--   booking_bridge -> "booking" | concierge -> "concierge"
-- so the pitch opens with the lead product pre-selected in the estimator.

-- 1. Mac's Grill — Cherryville — WEBSITE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Mac''s Grill', 'https://www.google.com/search?q=Mac%27s+Grill+Cherryville+NC', 'Cherryville',
       'website', 'front_desk', 4.6, 357,
       'No real website (the only "macsgrill.com" is an unrelated Maine steakhouse); takeout-only.',
       'https://restaurantguru.com/Macs-Grill-Cherryville', 'web_research', '["website"]'::jsonb,
       'Pitch: WEBSITE. 4.6 stars / ~357 reviews but zero web presence — customers can''t even see a menu. Secondary: online ordering / AI receptionist (drops calls at lunch rush).'
where not exists (select 1 from public.prospects where business_name = 'Mac''s Grill');

-- 2. Wrenches & Ratchets Auto Repair — Gastonia — WEBSITE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Wrenches & Ratchets Auto Repair', 'https://www.google.com/search?q=Wrenches+%26+Ratchets+Auto+Repair+Gastonia+NC', 'Gastonia',
       'website', 'front_desk', 4.9, 84,
       'Owned domain (wrenchesandratchets.net) is dead/parked; BBB lists only their Facebook page.',
       'https://www.carfax.com/Reviews-Wrenches-and-Ratchets-Auto-Repair-Gastonia-NC_NCWZ20SDNF', 'web_research', '["website"]'::jsonb,
       'Pitch: WEBSITE. 4.9 stars / ~72-84 reviews but invisible to search (dead domain). Secondary: AI receptionist (techs under cars miss calls).'
where not exists (select 1 from public.prospects where business_name = 'Wrenches & Ratchets Auto Repair');

-- 3. Cooper Family Dentistry — Gastonia — WEBSITE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Cooper Family Dentistry', 'https://cooperfamilydentistry.org', 'Gastonia',
       'website', 'booking_bridge', 4.9, null,
       'Dated, non-mobile WordPress; phone-only "call for an appointment"; practice since 1946.',
       'https://cooperfamilydentistry.org/', 'web_research', '["website"]'::jsonb,
       'Pitch: WEBSITE. ~4.9 stars and an 80-year reputation on a dead-end dated site. HIPAA. Verify exact Google review count on Maps.'
where not exists (select 1 from public.prospects where business_name = 'Cooper Family Dentistry');

-- 4. Gaston Dental Associates — Gastonia — AI RECEPTIONIST
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Gaston Dental Associates', 'https://gastondentalassociates.com', 'Gastonia',
       'front_desk', 'booking_bridge', 4.7, 948,
       'Modern site but intake is a "Request Appointment" form only; ~948 reviews = very high call volume.',
       'https://gastondentalassociates.com/', 'web_research', '["frontDesk"]'::jsonb,
       'Pitch: AI RECEPTIONIST. ~948 reviews against form-only intake — a 24/7 AI answers, screens, and books. HIPAA.'
where not exists (select 1 from public.prospects where business_name = 'Gaston Dental Associates');

-- 5. Mount Holly Dentistry — Mount Holly — AI RECEPTIONIST
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Mount Holly Dentistry', 'https://mounthollydentist.com', 'Mount Holly',
       'front_desk', 'booking_bridge', 4.8, 770,
       'Phone-only scheduling, no online booking found; 770 reviews = a slammed front desk.',
       'https://reviews.birdeye.com/mount-holly-dentistry-148376715319130', 'web_research', '["frontDesk"]'::jsonb,
       'Pitch: AI RECEPTIONIST. Capture missed and after-hours calls. HIPAA.'
where not exists (select 1 from public.prospects where business_name = 'Mount Holly Dentistry');

-- 6. Minick Law — Gastonia — AI RECEPTIONIST
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Minick Law', 'https://www.minicklaw.com/gastonia/', 'Gastonia',
       'front_desk', 'concierge', 4.9, 126,
       'DWI/criminal defense; phone/lead-form intake; arrests happen nights/weekends — first firm to answer wins.',
       'https://www.minicklaw.com/gastonia/', 'web_research', '["frontDesk"]'::jsonb,
       'Pitch: AI RECEPTIONIST (24/7 intake). Privilege-sensitive: pitch secure capture + human handoff.'
where not exists (select 1 from public.prospects where business_name = 'Minick Law');

-- 7. Perrigo Heating & Air — Belmont — BOOKING BRIDGE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Perrigo Heating & Air', 'https://www.perrigoheating.com', 'Belmont',
       'booking_bridge', 'front_desk', null, null,
       'Dated site, "Free Estimate" form + phone only, no online booking; 45-yr HVAC, BBB A+.',
       'https://www.perrigoheating.com/', 'web_research', '["booking"]'::jsonb,
       'Pitch: BOOKING BRIDGE — capture after-hours service requests. Secondary: AI receptionist. Verify Google rating on Maps.'
where not exists (select 1 from public.prospects where business_name = 'Perrigo Heating & Air');

-- 8. Hannon Orthodontics — Belmont — BOOKING BRIDGE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Hannon Orthodontics', 'https://hannonorthodontics.com', 'Belmont',
       'booking_bridge', 'front_desk', null, null,
       'Modern site but "Book Appointment" is a FormLync request form, not real scheduling; multi-location (Belmont + Gastonia).',
       'https://hannonorthodontics.com/', 'web_research', '["booking"]'::jsonb,
       'Pitch: BOOKING BRIDGE — true self-serve consult scheduling across both Gaston locations. Bigger fish; verify Google volume.'
where not exists (select 1 from public.prospects where business_name = 'Hannon Orthodontics');

-- 9. AB Carter, Inc. — Gastonia — AI CONCIERGE (the Bisque twin)
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'AB Carter, Inc.', 'https://www.abcarter.com', 'Gastonia',
       'concierge', 'website', null, null,
       'Century-old textile-mill supplier; deep technical catalog on a brochure site with no product search.',
       'https://www.abcarter.com/about-us/', 'web_research', '["concierge"]'::jsonb,
       'Pitch: AI CONCIERGE — closest twin to the Bisque win. Secondary: catalog/website modernization. B2B (founded 1922), review-light by nature.'
where not exists (select 1 from public.prospects where business_name = 'AB Carter, Inc.');

-- 10. Complete Eye Care — Belmont — AI CONCIERGE
insert into public.prospects
  (business_name, business_url, city, primary_product, secondary_product, rating, review_count, gap_summary, source_url, discovery_source, selected_services, notes)
select 'Complete Eye Care', 'https://www.completeeyecare.net', 'Belmont',
       'concierge', 'front_desk', 4.8, 886,
       'Site + online booking already solid; specialty optometry fields heavy repeat FAQ (insurance accepted, candidacy, pricing).',
       'https://www.completeeyecare.net/', 'web_research', '["concierge"]'::jsonb,
       'Pitch: AI CONCIERGE (FAQ deflection). HIPAA. Google-specific review count unconfirmed (hundreds across platforms).'
where not exists (select 1 from public.prospects where business_name = 'Complete Eye Care');
