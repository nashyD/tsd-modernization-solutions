-- backfill-fit-score.sql
-- Compute a 0-100 fit score for EVERY prospect so the team can rank deals by
-- potential. Higher = more valuable + more winnable. Re-runnable and idempotent;
-- run it again any time prospect data changes (e.g. after the leadboard seed).
--
-- Components (max ~100):
--   value (0-56)         the first dollar figure in gap_summary = the monthly
--                        leak we'd save them; x0.08, capped (so ~$700/mo -> 56).
--   reachability (0-23)  +15 a real email, +8 a named contact.
--   establishment (0-24) review_count buckets (0/6/12/18) + rating (0/3/6).
--
-- Bishop uses this in reverse: /sales/practice lists LOWEST fit first, so he can
-- warm up his cold-calling on throwaway leads without burning a high-fit one.

update public.prospects p
set fit_score = least(100, round(
      least(56,
        coalesce(
          nullif((regexp_match(coalesce(p.gap_summary, ''), '\$([0-9]+)'))[1], '')::numeric,
          0
        ) * 0.08
      )
    + case when coalesce(p.email, '') <> '' then 15 else 0 end
    + case when coalesce(p.contact_name, '') <> '' then 8 else 0 end
    + case when coalesce(p.review_count, 0) >= 100 then 18
           when coalesce(p.review_count, 0) >= 40  then 12
           when coalesce(p.review_count, 0) >= 10  then 6
           else 0 end
    + case when coalesce(p.rating, 0) >= 4.5 then 6
           when coalesce(p.rating, 0) >= 4.0 then 3
           else 0 end
  )::numeric);
