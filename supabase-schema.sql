create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default '90+minutes'
    check (char_length(brand_name) between 1 and 32),
  announcement text not null default ''
    check (char_length(announcement) <= 180),
  featured_competitions text[] not null default
    array['700', '740', '720', '730', '710', '715', '725', '630', '745']::text[],
  ad_enabled boolean not null default false,
  ad_title text not null default '' check (char_length(ad_title) <= 60),
  ad_message text not null default '' check (char_length(ad_message) <= 180),
  ad_cta_label text not null default '' check (char_length(ad_cta_label) <= 24),
  ad_url text not null default '' check (char_length(ad_url) <= 500),
  updated_at timestamptz not null default now()
);

alter table public.site_settings
  add column if not exists ad_enabled boolean not null default false,
  add column if not exists ad_title text not null default '',
  add column if not exists ad_message text not null default '',
  add column if not exists ad_cta_label text not null default '',
  add column if not exists ad_url text not null default '';

alter table public.site_settings
  alter column ad_enabled set default false,
  alter column ad_title set default '',
  alter column ad_message set default '',
  alter column ad_cta_label set default '',
  alter column ad_url set default '';

alter table public.site_settings enable row level security;

grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Only the site admin can insert settings" on public.site_settings;
create policy "Only the site admin can insert settings"
  on public.site_settings
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com');

drop policy if exists "Only the site admin can update settings" on public.site_settings;
create policy "Only the site admin can update settings"
  on public.site_settings
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com');

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

update public.site_settings
set ad_enabled = false
where id = true and ad_enabled;

create table if not exists public.site_adverts (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('top_banner', 'popup')),
  headline text not null check (char_length(headline) between 1 and 80),
  description text not null check (char_length(description) between 1 and 220),
  button_text text not null check (char_length(button_text) between 1 and 32),
  button_url text not null check (char_length(button_url) <= 500 and button_url ~* '^https://'),
  background_image_url text not null default '',
  logo_image_url text not null default '',
  is_enabled boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists site_adverts_one_active_per_placement_idx
  on public.site_adverts (placement)
  where is_enabled and is_published;

alter table public.site_adverts enable row level security;
revoke all on public.site_adverts from anon, authenticated;
grant select on public.site_adverts to anon, authenticated;
grant insert, update, delete on public.site_adverts to authenticated;

alter table public.site_adverts
  add column if not exists click_count integer not null default 0,
  add column if not exists start_date date,
  add column if not exists end_date date;

create or replace function public.increment_advert_click(p_advert_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.site_adverts
  set click_count = coalesce(click_count, 0) + 1
  where id = p_advert_id;
end;
$$;

revoke all on function public.increment_advert_click(uuid) from public;
grant execute on function public.increment_advert_click(uuid) to anon, authenticated;

drop policy if exists "Public can read published enabled adverts" on public.site_adverts;
create policy "Public can read published enabled adverts"
  on public.site_adverts
  for select
  to anon, authenticated
  using (is_published and is_enabled);

drop policy if exists "Only the site admin can manage adverts" on public.site_adverts;
create policy "Only the site admin can manage adverts"
  on public.site_adverts
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-adverts',
  'site-adverts',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view advert images" on storage.objects;
create policy "Public can view advert images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'site-adverts');

drop policy if exists "Only the site admin can upload advert images" on storage.objects;
create policy "Only the site admin can upload advert images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'site-adverts'
    and (auth.jwt() ->> 'email') = 'peckinssmart@gmail.com'
  );

drop policy if exists "Only the site admin can update advert images" on storage.objects;
create policy "Only the site admin can update advert images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'site-adverts'
    and (auth.jwt() ->> 'email') = 'peckinssmart@gmail.com'
  )
  with check (
    bucket_id = 'site-adverts'
    and (auth.jwt() ->> 'email') = 'peckinssmart@gmail.com'
  );

drop policy if exists "Only the site admin can delete advert images" on storage.objects;
create policy "Only the site admin can delete advert images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'site-adverts'
    and (auth.jwt() ->> 'email') = 'peckinssmart@gmail.com'
  );

create table if not exists public.site_visits (
  visit_date date not null default current_date,
  session_id uuid not null,
  primary key (visit_date, session_id)
);

create index if not exists site_visits_visit_date_idx
  on public.site_visits (visit_date);

alter table public.site_visits enable row level security;
revoke all on public.site_visits from anon, authenticated;
grant select on public.site_visits to authenticated;

drop policy if exists "Only the site admin can read visitor counts" on public.site_visits;
create policy "Only the site admin can read visitor counts"
  on public.site_visits
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com');

create or replace function public.record_site_visit(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_session_id is null then
    raise exception 'A session id is required.';
  end if;

  delete from public.site_visits
  where visit_date < current_date - 30;

  insert into public.site_visits (visit_date, session_id)
  values (current_date, p_session_id)
  on conflict (visit_date, session_id) do nothing;
end;
$$;

revoke all on function public.record_site_visit(uuid) from public;
grant execute on function public.record_site_visit(uuid) to anon, authenticated;

-- Custom leagues table
create table if not exists public.custom_leagues (
  id text primary key,
  name text not null check (char_length(name) between 1 and 60),
  country text not null default '' check (char_length(country) <= 60),
  badge_url text not null default '',
  espn_id text not null default '',
  display_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.custom_leagues enable row level security;
revoke all on public.custom_leagues from anon, authenticated;
grant select on public.custom_leagues to anon, authenticated;
grant insert, update, delete on public.custom_leagues to authenticated;

drop policy if exists "Public can read custom leagues" on public.custom_leagues;
create policy "Public can read custom leagues"
  on public.custom_leagues
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Only the site admin can manage custom leagues" on public.custom_leagues;
create policy "Only the site admin can manage custom leagues"
  on public.custom_leagues
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'peckinssmart@gmail.com');
