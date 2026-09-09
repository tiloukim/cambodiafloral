-- Payment processor fees on orders (PayPal)
-- Run this in the Supabase SQL editor.
--
-- PayPal deducts a fee from every capture, so the money that actually lands in
-- the account is less than the order total. The capture response reports the
-- exact split (seller_receivable_breakdown); these columns record it so the
-- P&L reflects real cash rather than an estimate.

alter table cf_orders add column if not exists payment_gross numeric(10,2); -- amount PayPal processed
alter table cf_orders add column if not exists payment_fee   numeric(10,2); -- PayPal's cut
alter table cf_orders add column if not exists payment_net   numeric(10,2); -- what actually lands in the account

comment on column cf_orders.payment_gross is 'Gross amount captured by the processor (USD)';
comment on column cf_orders.payment_fee   is 'Processor fee deducted from the capture (USD)';
comment on column cf_orders.payment_net   is 'Net amount credited to the account (USD)';
