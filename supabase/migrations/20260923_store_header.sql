alter table public.stores add column if not exists store_header jsonb not null default '{}'::jsonb;
