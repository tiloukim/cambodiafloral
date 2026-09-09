-- Consent + approval before any customer words appear on the site
-- Run this in the Supabase SQL editor.

-- 1. Private feedback is publishable only if the customer said it could be.
alter table cf_orders add column if not exists feedback_consent boolean not null default false;

comment on column cf_orders.feedback_consent is 'Customer ticked "you may share this on the website"; without it feedback stays private forever';

-- 2. New reviews arrive pending, not live. They previously defaulted to
--    approved, so a customer submission appeared on the product page (and in
--    the aggregateRating rich result) with nobody having read it first.
alter table cf_reviews alter column approved set default false;
