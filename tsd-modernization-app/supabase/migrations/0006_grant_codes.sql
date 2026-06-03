-- Grant's pitch-page coupon codes. The app lowercases codes on entry
-- (upsertDiscountCode + the checkout lookup), so "Grant5" matches "grant5".
-- These replace the original g5/g10/g15 placeholder seeds as the codes Grant
-- actually hands out at the table.
insert into public.discount_codes (code, pct, active) values
  ('grant5', 5, true),
  ('grant10', 10, true)
on conflict (code) do update set pct = excluded.pct, active = true;

-- Retire the original placeholder codes so Grant5 / Grant10 are the canonical
-- set. Deactivated (not deleted) so they can be flipped back on in /sales/codes.
update public.discount_codes set active = false where code in ('g5', 'g10', 'g15');
