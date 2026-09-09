-- One-per-customer reward for completing the "how did you find us?" survey
-- Run this in the Supabase SQL editor.
--
-- The code itself lives in cf_promo_codes like any other promo (single-use,
-- 5% off, 90-day expiry). These columns are the record of who has already been
-- rewarded, so a customer can never earn a second one.

alter table cf_customers add column if not exists survey_reward_code text;
alter table cf_customers add column if not exists survey_reward_at   timestamptz;

comment on column cf_customers.survey_reward_code is 'Promo code granted for completing the survey; non-null means already rewarded';
