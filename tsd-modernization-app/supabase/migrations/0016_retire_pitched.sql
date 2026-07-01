-- 0016: retire the legacy 'pitched' status. 0012 added the four funnel
-- sub-stages (contacted / demo_shown / fit_call / proposal) that refine it;
-- with the instrumented funnel live, one ambiguous catch-all stage only
-- muddies the ratios. Pre-instrumentation rows map to demo_shown ("we showed
-- them something"), the closest honest equivalent.
--
-- BEFORE RUNNING, eyeball the rows this touches:
--   select id, business_name, status, touch_count, created_at
--     from public.prospects where status = 'pitched';
-- If any pitched row actually had a proposal out, hand-set it to 'proposal'
-- first. No synthetic stage events are written for the mapping: legacy rows
-- correctly contribute nothing to measured transition ratios.

update public.prospects
  set status = 'demo_shown'
  where status = 'pitched';

alter table public.prospects
  drop constraint if exists prospects_status_check;
alter table public.prospects
  add constraint prospects_status_check
  check (status in (
    'new','contacted','demo_shown','fit_call','proposal','won','lost'
  ));
