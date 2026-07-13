import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MonthReport } from "@/components/MonthReport";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import type { TimeLog } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { userId } = await requireProfile();
  const supabase = createClient();
  const lang = getLang();

  // Scoped to the current user explicitly (admins' RLS would otherwise return
  // everyone). Filtered by month client-side.
  const { data: logs } = await supabase
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t(lang, "history.title")}</h1>
        <p className="text-base text-fg-muted">{t(lang, "history.subtitle")}</p>
      </div>
      <MonthReport logs={(logs ?? []) as TimeLog[]} />
    </div>
  );
}
