create extension if not exists pgcrypto;

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  expo_push_token text not null,
  platform text check (platform in ('ios','android','web')),
  is_tester boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists idx_devices_user on public.devices(user_id);
create unique index if not exists uniq_devices_token on public.devices(expo_push_token);
