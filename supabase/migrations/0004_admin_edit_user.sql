-- ============================================================================
-- Admin-only edit + password reset, callable via RPC (anon key + admin
-- session). SECURITY DEFINER, gated on is_admin(). No service-role key.
-- ============================================================================

create or replace function public.admin_update_user(
  p_user_id uuid,
  p_full_name text,
  p_email text,
  p_role text
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
  v_role text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  v_email := lower(trim(p_email));
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;
  v_role := case when p_role = 'admin' then 'admin' else 'employee' end;

  if exists (select 1 from auth.users where email = v_email and id <> p_user_id) then
    raise exception 'email_exists';
  end if;

  update auth.users set
    email = v_email,
    email_confirmed_at = coalesce(email_confirmed_at, pg_catalog.now()),
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
      || pg_catalog.jsonb_build_object('full_name', p_full_name, 'role', v_role),
    updated_at = pg_catalog.now()
  where id = p_user_id;

  if not found then
    raise exception 'not_found';
  end if;

  update auth.identities set
    identity_data = identity_data || pg_catalog.jsonb_build_object('email', v_email),
    updated_at = pg_catalog.now()
  where user_id = p_user_id and provider = 'email';

  update public.profiles set
    full_name = p_full_name,
    email = v_email,
    role = v_role
  where id = p_user_id;

  return pg_catalog.json_build_object('ok', true);
end;
$$;

create or replace function public.admin_set_password(
  p_user_id uuid,
  p_password text
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if p_password is null or length(p_password) < 6 then
    raise exception 'weak_password';
  end if;

  update auth.users set
    encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
    updated_at = pg_catalog.now()
  where id = p_user_id;

  if not found then
    raise exception 'not_found';
  end if;

  return pg_catalog.json_build_object('ok', true);
end;
$$;

revoke execute on function public.admin_update_user(uuid, text, text, text) from public, anon;
grant execute on function public.admin_update_user(uuid, text, text, text) to authenticated;
revoke execute on function public.admin_set_password(uuid, text) from public, anon;
grant execute on function public.admin_set_password(uuid, text) to authenticated;
