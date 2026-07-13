-- ============================================================================
-- Self-contained admin user creation (no service-role key required).
-- ============================================================================

-- Store the email on the profile so the admin UI can show it without the
-- service-role key.
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- Include email when auto-creating profiles.
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

  insert into public.profiles (id, full_name, role, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', meta_role, new.email)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        email = excluded.email;

  return new;
end;
$$;

-- Admin-only user creation, callable via RPC with the anon key + the admin's
-- session (no service-role key needed). SECURITY DEFINER so it can write the
-- auth schema; gated on is_admin(). Empty search_path + fully-qualified names.
create or replace function public.admin_create_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_role text;
  v_email text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  v_email := lower(trim(p_email));
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;
  if p_password is null or length(p_password) < 6 then
    raise exception 'weak_password';
  end if;
  v_role := case when p_role = 'admin' then 'admin' else 'employee' end;

  if exists (select 1 from auth.users where email = v_email) then
    raise exception 'email_exists';
  end if;

  v_uid := pg_catalog.gen_random_uuid();

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
    v_email, extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
    pg_catalog.now(), pg_catalog.now(), pg_catalog.now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    pg_catalog.jsonb_build_object('full_name', p_full_name, 'role', v_role),
    '', '', '', ''
  );

  insert into auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_uid::text, v_uid,
    pg_catalog.jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    'email', pg_catalog.now(), pg_catalog.now(), pg_catalog.now()
  );

  -- profile is created by the on_auth_user_created trigger (handle_new_user).
  return pg_catalog.json_build_object('ok', true, 'id', v_uid);
end;
$$;

revoke execute on function public.admin_create_user(text, text, text, text) from public, anon;
grant execute on function public.admin_create_user(text, text, text, text) to authenticated;
