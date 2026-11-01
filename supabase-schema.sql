create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default '90+minutes'
    check (char_length(brand_name) between 1 and 32),
  announcement text not null default ''
    check (char_length(announcement) <= 180),
  featured_competitions text[] not null default
    array['700', '740', '720', '730', '710', '715', '725', '630', '745']::text[],
  updated_at timestamptz not null default now()
);

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
