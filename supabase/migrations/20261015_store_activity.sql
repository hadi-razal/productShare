-- Store owner behaviour log for the super admin panel.
create table if not exists public.store_activity (
  id text primary key default gen_random_uuid()::text,
  store_id text not null references public.stores(id) on delete cascade,
  type text not null check (type in (
    'session', 'product_added', 'product_updated', 'product_deleted',
    'settings_saved', 'store_offline', 'store_live', 'enquiry'
  )),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists store_activity_store_created_idx
  on public.store_activity (store_id, created_at desc);

alter table public.store_activity enable row level security;

-- Shoppers (anon) log enquiry counts; owners log their own actions. Only signed-in users can read.
drop policy if exists "insert store_activity" on public.store_activity;
create policy "insert store_activity" on public.store_activity
  for insert to anon, authenticated
  with check (type = 'enquiry' or auth.uid()::text = store_id);

drop policy if exists "read store_activity" on public.store_activity;
create policy "read store_activity" on public.store_activity
  for select to authenticated
  using (true);

grant select, insert on table public.store_activity to authenticated;
grant insert on table public.store_activity to anon;

alter table public.stores add column if not exists last_active_at timestamptz;
