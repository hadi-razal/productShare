-- ProductShare schema. Run this in the Supabase SQL editor.

create table if not exists stores (
  id text primary key,
  uid text,
  username text unique not null,
  name text,
  email text,
  whatsapp_number text,
  additional_notes text,
  logo_image text,
  image text,
  theme_color text default '#000000',
  store_theme text not null default 'minimal',
  description text,
  visit_count integer not null default 0,
  visitor_data jsonb not null default '[]'::jsonb,
  low_stock_items integer,
  is_premium_user boolean not null default false,
  subscription_id text,
  subscribed_at timestamptz,
  is_offline boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  store_id text not null references stores(id) on delete cascade,
  name text not null default '',
  description text not null default '',
  category text not null default '',
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  regular_price text,
  discount_price text,
  video text,
  is_new boolean not null default false,
  is_in_stock boolean not null default true,
  is_best_selling boolean not null default false,
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  is_most_selling boolean not null default false,
  is_free_delivery boolean not null default false,
  views integer not null default 0,
  rating numeric,
  total_reviews integer,
  rating_count integer,
  available_stock text,
  tags text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists products_store_id_idx on products(store_id);
create index if not exists stores_username_idx on stores(username);

alter table stores add column if not exists is_offline boolean not null default false;
alter table stores add column if not exists store_theme text not null default 'minimal';

create or replace function increment_store_visits(p_id text)
returns void
language sql
as $$
  update stores
  set visit_count = coalesce(visit_count, 0) + 1
  where id = p_id;
$$;

create or replace function increment_product_views(p_id text)
returns void
language sql
as $$
  update products
  set views = coalesce(views, 0) + 1
  where id = p_id;
$$;

alter table stores enable row level security;
alter table products enable row level security;

drop policy if exists "public stores" on stores;
create policy "public stores" on stores
  for all
  using (true)
  with check (true);

drop policy if exists "public products" on products;
create policy "public products" on products
  for all
  using (true)
  with check (true);

grant all on table stores to anon, authenticated;
grant all on table products to anon, authenticated;
grant execute on function increment_store_visits(text) to anon, authenticated;
grant execute on function increment_product_views(text) to anon, authenticated;

-- Public bucket for product images, videos, and store logos.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

drop policy if exists "public read uploads" on storage.objects;
create policy "public read uploads"
on storage.objects for select
to public
using (bucket_id = 'uploads');

drop policy if exists "auth upload uploads" on storage.objects;
create policy "auth upload uploads"
on storage.objects for insert
to authenticated
with check (bucket_id = 'uploads');

drop policy if exists "auth update uploads" on storage.objects;
create policy "auth update uploads"
on storage.objects for update
to authenticated
using (bucket_id = 'uploads')
with check (bucket_id = 'uploads');

drop policy if exists "auth delete uploads" on storage.objects;
create policy "auth delete uploads"
on storage.objects for delete
to authenticated
using (bucket_id = 'uploads');
