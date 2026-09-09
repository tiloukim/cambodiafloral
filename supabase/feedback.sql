-- Customer feedback on the order experience
-- Run this in the Supabase SQL editor.
--
-- Distinct from cf_reviews, which are public, per-product and moderated for
-- rich results. This is private service feedback about one order: how the
-- delivery went, collected next to the "how did you find us?" answer.

alter table cf_orders add column if not exists feedback_rating  smallint check (feedback_rating between 1 and 5);
alter table cf_orders add column if not exists feedback_comment text;
alter table cf_orders add column if not exists feedback_at      timestamptz;

comment on column cf_orders.feedback_rating is '1-5 stars on the order experience (private, not a product review)';
