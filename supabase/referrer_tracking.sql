-- Measured traffic attribution on orders
-- Run this in the Supabase SQL editor.
--
-- The survey records what the customer *says*; these record where the browser
-- actually came from, captured on their first visit and carried to checkout.
-- Both are useful: self-reported answers cover word-of-mouth that no referrer
-- can show, and measured data covers everyone who never answers.

alter table cf_orders add column if not exists referrer      text; -- full referring URL on first visit
alter table cf_orders add column if not exists referrer_host text; -- e.g. google.com, facebook.com
alter table cf_orders add column if not exists landing_page  text; -- first page they landed on
alter table cf_orders add column if not exists utm_source    text;
alter table cf_orders add column if not exists utm_medium    text;
alter table cf_orders add column if not exists utm_campaign  text;
alter table cf_orders add column if not exists traffic_source text; -- normalised: google / facebook / direct / ...

comment on column cf_orders.traffic_source is 'Normalised first-touch source, comparable with heard_from';
