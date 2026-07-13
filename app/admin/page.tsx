import { createClient } from "@/lib/supabase/server";
import { AdminTimesheet } from "@/components/AdminTimesheet";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import type { Profile, TimeLogWithProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminTimesheetPage() {
  const supabase = createClient();
  const lang = getLang();

  // Admin RLS allows reading every log + profile.
  const [{ data: logs }, { data: employees }] = await Promise.all([
    supabase
      .from("time_logs")
      .select("*, profiles(full_name, role)")
      .order("work_date", { ascending: false })
      .order("start_time", { ascending: false }),
    supabase
      .from("profiles")
      .select("*")
      .order("full_name", { ascending: true }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t(lang, "admin.title")}</h1>
        <p className="text-base text-fg-muted">{t(lang, "admin.subtitle")}</p>
      </div>

      <AdminTimesheet
        rows={(logs ?? []) as TimeLogWithProfile[]}
        employees={(employees ?? []) as Profile[]}
      />
    </div>
  );
}
