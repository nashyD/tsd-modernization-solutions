-- Atomic per-prospect daily cap for the public showcase voice demo.
--
-- Replaces the racy count-then-insert in /api/showcase/[token]/voice-grant.
-- A transaction-scoped advisory lock keyed by the prospect serializes
-- concurrent claims, so a burst of taps on a forwarded showcase link can no
-- longer slip past the cap (each .rpc() runs in its own autocommit txn, so the
-- lock is held only for the duration of this function and released right after).
--
-- Returns true and records the call if under the cap; false if the cap is hit.
create or replace function public.claim_showcase_voice_call(
  p_prospect_id uuid,
  p_cap integer
)
returns boolean
language plpgsql
as $$
declare
  recent_calls integer;
begin
  -- Serialize concurrent claims for this prospect (auto-released at txn end).
  perform pg_advisory_xact_lock(hashtextextended(p_prospect_id::text, 0));

  select count(*) into recent_calls
  from public.showcase_voice_calls
  where prospect_id = p_prospect_id
    and created_at >= now() - interval '24 hours';

  if recent_calls >= p_cap then
    return false;
  end if;

  insert into public.showcase_voice_calls (prospect_id)
  values (p_prospect_id);

  return true;
end;
$$;
