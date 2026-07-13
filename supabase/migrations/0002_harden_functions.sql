-- ============================================================================
-- Security hardening — resolves Supabase advisor warnings from 0001.
-- ============================================================================

-- Pin search_path on the trigger function (advisor 0011).
alter function public.reject_future_work_date() set search_path = public;

-- Trigger functions fire automatically as the table owner; they do not need to
-- be callable via the REST RPC endpoint. Revoke EXECUTE from API roles
-- (advisors 0028/0029).
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_admin() is used inside RLS policies by signed-in users, so keep it
-- callable by `authenticated`, but not by anon/public.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
