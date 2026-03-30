-- Run this once in: Supabase Dashboard → SQL Editor → New Query

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now() not null,
  product_name text not null,
  size         text not null,
  quantity     integer not null default 1,
  colour       text not null,
  mobile       text not null,
  address      text not null,
  status       text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled'))
);

alter table public.orders enable row level security;

create policy "Allow public insert" on public.orders for insert with check (true);
create policy "Admin read"          on public.orders for select using (auth.role() = 'service_role');

create index if not exists orders_created_at_idx on public.orders(created_at desc);
