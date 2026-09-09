-- "How did you hear about us?" — marketing attribution on orders
-- Run this in the Supabase SQL editor.
--
-- Captured two ways: an optional dropdown at checkout, and a one-click link in
-- the order confirmation email for customers who skipped it.

alter table cf_orders add column if not exists heard_from        text; -- source key, see lib/attribution.ts
alter table cf_orders add column if not exists heard_from_detail text; -- free text when the answer is "other"
alter table cf_orders add column if not exists heard_from_at     timestamptz; -- when the answer was given

comment on column cf_orders.heard_from is 'How the customer found the shop: google, facebook, instagram, tiktok, telegram, friend, returning, other';
