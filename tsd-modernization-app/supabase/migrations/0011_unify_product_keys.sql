-- Unify the product vocabulary. The pitch estimator historically used camelCase
-- ids (frontDesk / leadEngine) and a candidate map emitted a phantom "booking" id,
-- none of which matched the canonical service_key set
-- (website / front_desk / concierge / booking_bridge). That mismatch made any
-- Booking/Lead-Engine-tagged prospect price to $0. The code now uses the canonical
-- keys everywhere; this backfills the only column that stored the old values:
-- prospects.selected_services (a jsonb string array).
--
-- Mapping: frontDesk -> front_desk, leadEngine -> booking_bridge, booking -> booking_bridge.
-- website / concierge were already canonical. Idempotent: only touches rows that
-- still contain a legacy value, and re-running is a no-op.
update public.prospects p
set selected_services = (
  select coalesce(jsonb_agg(distinct to_jsonb(
    case el #>> '{}'
      when 'frontDesk'  then 'front_desk'
      when 'leadEngine' then 'booking_bridge'
      when 'booking'    then 'booking_bridge'
      else el #>> '{}'
    end
  )), '[]'::jsonb)
  from jsonb_array_elements(p.selected_services) el
)
where p.selected_services @> '"frontDesk"'::jsonb
   or p.selected_services @> '"leadEngine"'::jsonb
   or p.selected_services @> '"booking"'::jsonb;
