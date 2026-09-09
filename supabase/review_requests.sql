-- Review request tracking
-- Run this in the Supabase SQL editor.
--
-- Records when a customer was last asked to review an order, so the admin can
-- see who has been asked and nobody gets nagged twice.

alter table cf_orders add column if not exists review_requested_at timestamptz;

comment on column cf_orders.review_requested_at is 'When a review request email was last sent for this order';
