-- Verified-buyer product reviews for Cambodia Floral
-- Run this in the Supabase SQL editor.

create table if not exists cf_reviews (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references cf_products(id) on delete cascade,
  order_id     uuid references cf_orders(id) on delete set null,
  customer_id  uuid references cf_customers(id) on delete set null,
  author_name  text not null,
  rating       integer not null check (rating between 1 and 5),
  title        text,
  body         text,
  approved     boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (order_id, product_id)   -- one review per product per order
);

create index if not exists cf_reviews_product_idx on cf_reviews (product_id);

-- All access is via the service role (server-side). No public policies.
alter table cf_reviews enable row level security;
