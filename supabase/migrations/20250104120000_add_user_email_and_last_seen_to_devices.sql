-- Add user_email and last_seen_at columns to devices table
-- Also ensure proper indexing for user queries

-- 1) Add user_email (nullable), last_seen_at (nullable)
alter table public.devices
  add column if not exists user_email text,
  add column if not exists last_seen_at timestamptz;

-- 2) Index useful for user-based queries
create index if not exists devices_user_id_idx on public.devices(user_id);

-- 3) Ensure uniqueness on expo_push_token (if not already in place)
do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'devices_expo_push_token_key'
  ) then
    -- Create a unique constraint (or unique index if you prefer)
    alter table public.devices
      add constraint devices_expo_push_token_key unique (expo_push_token);
  end if;
end$$;

-- 4) Optional: backfill emails from auth.users if available (leave NULL if not)
-- update public.devices d
-- set user_email = u.email
-- from auth.users u
-- where d.user_email is null and d.user_id = u.id;
