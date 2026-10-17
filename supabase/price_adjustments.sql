-- Bulk price change history (so a bulk change can be undone)
-- Run this in the Supabase SQL editor.
--
-- A bulk repricing touches every product at once. Without a snapshot of what
-- the prices were, a mistyped percentage is unrecoverable — these rows are
-- what makes "undo" possible.

create table if not exists cf_price_adjustments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  description text not null,                 -- e.g. "+25% on cakes (12 products)"
  snapshot    jsonb not null,                -- [{id, price, compare_price}, ...] BEFORE the change
  product_count integer not null default 0,
  undone_at   timestamptz
);

alter table cf_price_adjustments enable row level security;
