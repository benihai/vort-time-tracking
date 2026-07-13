-- ============================================================================
-- Vort Time Tracking — initial schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / drops-then-creates.
-- ============================================================================

-- Required for the "no overlapping hours" exclusion constraint:
-- btree_gist lets us combine an equality (user_id) with a range (&&) in one
-- GiST exclusion constraint.
create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, holds role + display name.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'employee' check (role in ('admin', 'employee')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- time_logs: one row per logged work interval.
-- ---------------------------------------------------------------------------
create table if not exists public.time_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  work_date   date not null,
  start_time  time not null,
  end_time    time not null,
  description text,
  created_at  timestamptz not null default now(),

  -- end must be after start (immutable -> allowed in CHECK)
  constraint end_after_start check (end_time > start_time),

  -- No overlapping intervals for the same user on the same day.
  -- Half-open range [start, end): 09:00-12:00 and 12:00-14:00 do NOT overlap.
  constraint no_overlap exclude using gist (
    user_id with =,
    tsrange((work_date + start_time), (work_date + end_time)) with &&
  )
);

create index if not exists time_logs_user_date_idx
  on public.time_logs (user_id, work_date);

-- ---------------------------------------------------------------------------
-- Block logging for future dates. CHECK can't use current_date (not
-- immutable), so we enforce it in a BEFORE trigger.
-- ---------------------------------------------------------------------------
create or replace function public.reject_future_work_date()
returns trigger
language plpgsql
as $$
begin
  if new.work_date > current_date then
    raise exception 'לא ניתן לדווח שעות על תאריך עתידי'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reject_future_date on public.time_logs;
create trigger trg_reject_future_date
  before insert or update on public.time_logs
  for each row execute function public.reject_future_work_date();

-- ---------------------------------------------------------------------------
-- Auto-create a profile whenever an auth user is created (via the Admin API
-- or the dashboard). Reads full_name + role from user metadata; defaults to
-- the 'employee' role for any missing/invalid value.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
begin
  meta_role := coalesce(new.raw_user_meta_data ->> 'role', 'employee');
  if meta_role not in ('admin', 'employee') then
    meta_role := 'employee';
  end if;

  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', meta_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- is_admin(): SECURITY DEFINER so it bypasses RLS -> no policy recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.time_logs enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_name" on public.profiles;
create policy "profiles_update_own_name"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- (Inserts happen through the handle_new_user trigger / service role, which
--  bypass RLS. No INSERT policy is granted to normal users by design.)

-- time_logs -----------------------------------------------------------------
drop policy if exists "time_logs_select_own_or_admin" on public.time_logs;
create policy "time_logs_select_own_or_admin"
  on public.time_logs for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "time_logs_insert_own" on public.time_logs;
create policy "time_logs_insert_own"
  on public.time_logs for insert
  with check (user_id = auth.uid());

drop policy if exists "time_logs_update_own" on public.time_logs;
create policy "time_logs_update_own"
  on public.time_logs for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "time_logs_delete_own_or_admin" on public.time_logs;
create policy "time_logs_delete_own_or_admin"
  on public.time_logs for delete
  using (user_id = auth.uid() or public.is_admin());

-- ============================================================================
-- FIRST ADMIN (run AFTER creating your first user in
-- Dashboard > Authentication > Users > "Add user", with "Auto Confirm" on).
-- Replace the email, then run:
--
--   update public.profiles
--   set role = 'admin', full_name = 'שם המנהל'
--   where id = (select id from auth.users where email = 'admin@example.com');
--
-- From then on, that admin creates everyone else inside the app.
-- ============================================================================
