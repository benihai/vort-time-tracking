import { createClient } from "@/lib/supabase/client";
import { toMinutes, todayISO } from "@/lib/time";
import type { Profile, TimeLog, TimeLogWithProfile } from "@/lib/types";

// Client-side data access against Supabase (RLS-enforced). Mutations return an
// i18n key on failure so the caller can localize the message.
export type ApiResult = { ok: true } | { ok: false; key: string };

/** Current user's logs, newest first. Scoped explicitly to the user (admins'
 *  RLS would otherwise return everyone). */
export async function fetchMyLogs(
  userId: string,
  opts?: { from?: string }
): Promise<TimeLog[]> {
  const supabase = createClient();
  let q = supabase
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });
  if (opts?.from) q = q.gte("work_date", opts.from);
  const { data } = await q;
  return (data ?? []) as TimeLog[];
}

/** Insert a log for the user. Client checks give friendly messages; the DB
 *  constraints are the real guarantee (overlap exclusion + future-date trigger). */
export async function addLog(input: {
  userId: string;
  work_date: string;
  start_time: string;
  end_time: string;
  description: string;
}): Promise<ApiResult> {
  const { userId, work_date, start_time, end_time, description } = input;

  if (!work_date || !start_time || !end_time) return { ok: false, key: "err.required" };
  if (work_date > todayISO()) return { ok: false, key: "err.future" };
  if (toMinutes(end_time) <= toMinutes(start_time)) return { ok: false, key: "err.order" };

  const supabase = createClient();

  const { data: sameDay } = await supabase
    .from("time_logs")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .eq("work_date", work_date);

  const s = toMinutes(start_time);
  const e = toMinutes(end_time);
  const clash = (sameDay ?? []).some(
    (r) => s < toMinutes(r.end_time) && toMinutes(r.start_time) < e
  );
  if (clash) return { ok: false, key: "err.overlap" };

  const { error } = await supabase.from("time_logs").insert({
    user_id: userId,
    work_date,
    start_time,
    end_time,
    description: description || null,
  });

  if (error) {
    if (error.code === "23P01") return { ok: false, key: "err.overlap" };
    if (error.code === "23514") return { ok: false, key: "err.invalid" };
    if (error.message?.includes("עתידי") || error.message?.includes("future"))
      return { ok: false, key: "err.future" };
    return { ok: false, key: "err.saveFailed" };
  }
  return { ok: true };
}

/** Delete one of the user's own logs (RLS enforces ownership). */
export async function deleteLog(id: string, userId: string): Promise<ApiResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("time_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  return error ? { ok: false, key: "err.deleteFailed" } : { ok: true };
}

/** All logs joined with owner profile (admin only; RLS allows it). */
export async function fetchAllLogs(): Promise<TimeLogWithProfile[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("time_logs")
    .select("*, profiles(full_name, role)")
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });
  return (data ?? []) as TimeLogWithProfile[];
}

/** All profiles (admin only). */
export async function fetchProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []) as Profile[];
}

/** Create a user via the admin-only SECURITY DEFINER RPC. Returns an i18n key
 *  on failure. */
export async function createUser(input: {
  email: string;
  password: string;
  full_name: string;
  role: string;
}): Promise<ApiResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_create_user", {
    p_email: input.email,
    p_password: input.password,
    p_full_name: input.full_name,
    p_role: input.role,
  });
  if (!error) return { ok: true };

  return { ok: false, key: rpcErrorKey(error.message) };
}

/** Update a user's name, email and role (admin only). */
export async function updateUser(input: {
  userId: string;
  full_name: string;
  email: string;
  role: string;
}): Promise<ApiResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_update_user", {
    p_user_id: input.userId,
    p_full_name: input.full_name,
    p_email: input.email,
    p_role: input.role,
  });
  return error ? { ok: false, key: rpcErrorKey(error.message) } : { ok: true };
}

/** Reset a user's password (admin only). */
export async function setPassword(
  userId: string,
  password: string
): Promise<ApiResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_set_password", {
    p_user_id: userId,
    p_password: password,
  });
  return error ? { ok: false, key: rpcErrorKey(error.message) } : { ok: true };
}

/** Map a raise-exception message from the admin RPCs to an i18n key. */
function rpcErrorKey(message?: string): string {
  const map: Record<string, string> = {
    forbidden: "users.errForbidden",
    invalid_email: "users.errEmail",
    weak_password: "users.errPassword",
    email_exists: "users.errExists",
    not_found: "users.errNotFound",
  };
  return map[(message ?? "").trim()] ?? "users.errFailed";
}
