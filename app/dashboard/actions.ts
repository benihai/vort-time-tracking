"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toMinutes, todayISO } from "@/lib/time";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Insert a time log for the current user. Validation runs at three layers;
 * this server action is the second (after client, before the DB constraints)
 * and returns messages localized to the user's language cookie.
 */
export async function addLog(formData: FormData): Promise<ActionResult> {
  const lang = getLang();
  const fail = (key: string): ActionResult => ({ ok: false, error: t(lang, key) });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("err.notAuth");

  const work_date = String(formData.get("work_date") ?? "").trim();
  const start_time = String(formData.get("start_time") ?? "").trim();
  const end_time = String(formData.get("end_time") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!work_date || !start_time || !end_time) return fail("err.required");
  if (work_date > todayISO()) return fail("err.future");
  if (toMinutes(end_time) <= toMinutes(start_time)) return fail("err.order");

  // Friendly pre-check for overlaps (the DB constraint is the real guarantee).
  const { data: sameDay } = await supabase
    .from("time_logs")
    .select("start_time, end_time")
    .eq("user_id", user.id)
    .eq("work_date", work_date);

  const s = toMinutes(start_time);
  const e = toMinutes(end_time);
  const clash = (sameDay ?? []).some(
    (r) => s < toMinutes(r.end_time) && toMinutes(r.start_time) < e
  );
  if (clash) return fail("err.overlap");

  const { error } = await supabase.from("time_logs").insert({
    user_id: user.id,
    work_date,
    start_time,
    end_time,
    description: description || null,
  });

  if (error) {
    if (error.code === "23P01") return fail("err.overlap");
    if (error.code === "23514") return fail("err.invalid");
    if (error.message?.includes("עתידי") || error.message?.includes("future"))
      return fail("err.future");
    return fail("err.saveFailed");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  return { ok: true };
}

/** Delete one of the current user's logs (RLS enforces ownership). */
export async function deleteLog(id: string): Promise<ActionResult> {
  const lang = getLang();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: t(lang, "err.notAuth") };

  const { error } = await supabase
    .from("time_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: t(lang, "err.deleteFailed") };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  return { ok: true };
}
