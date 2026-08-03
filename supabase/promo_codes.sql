-- Promo / discount codes for Cambodia Floral
-- Run this in the Supabase SQL editor.

create table if not exists cf_promo_codes (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,          -- stored UPPERCASE
  discount_type  text not null check (discount_type in ('percent','fixed','free_delivery')),
  discount_value numeric not null default 0,    -- percent: 0-100 · fixed: USD · free_delivery: ignored
  min_subtotal   numeric not null default 0,    -- minimum cart subtotal required
  max_uses       integer,                       -- null = unlimited · 1 = one-time
  used_count     integer not null default 0,
  expires_at     timestamptz,                   -- null = never expires
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Only the service role (server-side code) may read/write. Codes are never public.
alter table cf_promo_codes enable row level security;

-- Applied-discount columns on orders
alter table cf_orders add column if not exists discount   numeric not null default 0;
alter table cf_orders add column if not exists promo_code text;
