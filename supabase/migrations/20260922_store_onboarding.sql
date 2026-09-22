-- Apply after schema.sql. Private drafts must never be stored in public stores rows.
create table if not exists public.store_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  details jsonb not null default '{}'::jsonb,
  onboarding_step integer not null default 0 check (onboarding_step between 0 and 6),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.store_onboarding enable row level security;
revoke all on public.store_onboarding from anon;
grant select, insert, update on public.store_onboarding to authenticated;
drop policy if exists "Owner reads draft" on public.store_onboarding;
create policy "Owner reads draft" on public.store_onboarding for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Owner creates draft" on public.store_onboarding;
create policy "Owner creates draft" on public.store_onboarding for insert to authenticated with check (auth.uid() = user_id and not onboarding_completed);
drop policy if exists "Owner updates draft" on public.store_onboarding;
create policy "Owner updates draft" on public.store_onboarding for update to authenticated using (auth.uid() = user_id and not onboarding_completed) with check (auth.uid() = user_id and not onboarding_completed);

alter table public.stores add column if not exists show_whatsapp_button boolean not null default true;
alter table public.stores add column if not exists allow_product_enquiries boolean not null default true;
alter table public.stores add column if not exists currency text not null default 'INR';

-- One transaction: a competing slug claim rolls back both profile and completion.
create or replace function public.complete_store_onboarding(details jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare owner_id uuid := auth.uid();
begin
  if owner_id is null then raise exception 'Authentication required'; end if;
  if length(trim(coalesce(details->>'full_name', ''))) < 2
    or length(trim(coalesce(details->>'store_name', ''))) < 2
    or coalesce(details->>'store_slug', '') !~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
    or coalesce(details->>'store_slug', '') in (
      'about','account','accounts','add','addproduct','admin','api','app','assets','auth',
      'beta','billing','blog','cdn','categories','category','checkout','contact','dashboard',
      'docs','edit','ftp','help','host','images','img','inventory','link','links','login',
      'logout','m','mail','media','my','new','ns','ns1','ns2','pay','payment','preview','pricing',
      'product','products','qr','register','reviews','root','settings','message','onboarding',
      'add-product','shop','signin','signup','smtp','ssl','staging','static','status','store',
      'stores','support','test','vercel','www'
    )
    or coalesce(details->>'email', '') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or coalesce(details->>'contact_number', '') !~ '^[0-9]{7,14}$'
    or length(coalesce(details->>'store_description', '')) > 160
    or coalesce(details->>'brand_color', '') !~ '^#[0-9a-fA-F]{6}$'
    or coalesce(details->>'country_code', '') not in ('+91', '+1', '+44', '+971', '+61')
    or (details->>'country_code' = '+91' and details->>'contact_number' !~ '^[6-9][0-9]{9}$')
    or coalesce(details->>'currency', '') not in ('INR', 'USD', 'EUR', 'GBP', 'AED')
    or length(trim(coalesce(details->>'city', ''))) = 0
    or length(trim(coalesce(details->>'state', ''))) = 0
    or coalesce(jsonb_typeof(details->'catalogue_sharing_methods'), '') <> 'array'
    or coalesce(details->>'show_whatsapp_button', '') not in ('true', 'false')
    or coalesce(details->>'allow_product_enquiries', '') not in ('true', 'false')
    or (details->>'show_whatsapp_button' = 'true' and coalesce(details->>'whatsapp_number', '') !~ '^[1-9][0-9]{7,14}$')
    or coalesce(details->>'business_category', '') not in ('Fashion & Clothing', 'Jewellery', 'Furniture', 'Electronics', 'Home Décor', 'Beauty & Cosmetics', 'Food Products', 'Building Materials', 'Automobile Accessories', 'Industrial Products', 'Wholesale & Distribution', 'Other')
    or (details->>'business_category' = 'Other' and length(trim(coalesce(details->>'custom_business_category', ''))) < 2)
    or coalesce(details->>'product_count_range', '') not in ('Fewer than 20', '20–50', '51–100', '101–500', 'More than 500')
    then raise exception 'Invalid onboarding data'; end if;
  if jsonb_array_length(details->'catalogue_sharing_methods') = 0 then raise exception 'Select sharing methods'; end if;
  insert into public.stores (
    id, uid, username, name, email, whatsapp_number, additional_notes, description,
    logo_image, theme_color, onboarding_completed, show_whatsapp_button, allow_product_enquiries, currency
  ) values (
    owner_id::text, owner_id::text, details->>'store_slug', details->>'store_name',
    (select email from auth.users where id = owner_id), details->>'whatsapp_number',
    details->>'store_description', details->>'store_description', details->>'store_logo_url',
    details->>'brand_color', true, (details->>'show_whatsapp_button')::boolean,
    (details->>'allow_product_enquiries')::boolean, details->>'currency'
  ) on conflict (id) do update set
    username = excluded.username, name = excluded.name, whatsapp_number = excluded.whatsapp_number,
    additional_notes = excluded.additional_notes, description = excluded.description,
    logo_image = excluded.logo_image, theme_color = excluded.theme_color, onboarding_completed = true,
    show_whatsapp_button = excluded.show_whatsapp_button,
    allow_product_enquiries = excluded.allow_product_enquiries, currency = excluded.currency;
  insert into public.store_onboarding(user_id, details, onboarding_step, onboarding_completed)
  values(owner_id, details, 6, true)
  on conflict (user_id) do update set details = excluded.details, onboarding_step = 6,
    onboarding_completed = true, updated_at = now();
end;
$$;
revoke all on function public.complete_store_onboarding(jsonb) from public, anon;
grant execute on function public.complete_store_onboarding(jsonb) to authenticated;
