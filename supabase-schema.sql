create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default '90+minutes'
    check (char_length(brand_name) between 1 and 32),
  announcement text not null default ''
    check (char_length(announcement) <= 180),
  featured_competitions text[] not null default
    array['700', '740', '720', '730', '710', '715', '725', '630', '745']::text[],
  ad_enabled boolean not null default true,
  ad_title text not null default 'Your matchday, all in one place' check (char_length(ad_title) <= 60),
  ad_message text not null default 'Follow live scores, upcoming fixtures, and league tables on 90+minutes.' check (char_length(ad_message) <= 180),
  ad_cta_label text not null default 'Explore matches' check (char_length(ad_cta_label) <= 24),
  ad_url text not null default 'https://peckins1st-2nd-project.vercel.app/#fixtures' check (char_length(ad_url) <= 500),
  updated_at timestamptz not null default now()
);

alter table public.site_settings
  add column if not exists ad_enabled boolean not null default true,
  add column if not exists ad_title text not null default 'Your matchday, all in one place',
  add column if not exists ad_message text not null default 'Follow live scores, upcoming fixtures, and league tables on 90+minutes.',
  add column if not exists ad_cta_label text not null default 'Explore matches',
  add column if not exists ad_url text not null default 'https://peckins1st-2nd-project.vercel.app/#fixtures';

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
set ad_enabled = true,
    ad_title = 'Your matchday, all in one place',
    ad_message = 'Follow live scores, upcoming fixtures, and league tables on 90+minutes.',
    ad_cta_label = 'Explore matches',
    ad_url = 'https://peckins1st-2nd-project.vercel.app/#fixtures'
where id = true
  and ad_enabled = false
  and ad_title = ''
  and ad_message = ''
  and ad_cta_label = ''
  and ad_url = '';

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
