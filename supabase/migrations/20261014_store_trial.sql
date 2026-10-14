-- One-month free trial for every store. Stores without Premium are locked after trial_ends_at.
alter table public.stores
  add column if not exists trial_ends_at timestamptz;

-- Existing stores get a fresh 30-day trial from launch (or from signup, if later).
update public.stores
set trial_ends_at = greatest(created_at, timestamptz '2026-10-14 00:00:00+00') + interval '30 days'
where trial_ends_at is null;

alter table public.stores
  alter column trial_ends_at set default (now() + interval '30 days');
