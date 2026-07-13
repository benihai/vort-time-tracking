import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LogForm } from "@/components/LogForm";
import { SummaryCards } from "@/components/SummaryCards";
import { RecentLogs } from "@/components/RecentLogs";
import { durationHours, monthStart, todayISO } from "@/lib/time";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/i18n";
import type { TimeLog } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { profile, userId } = await requireProfile();
  const supabase = createClient();
  const lang = getLang();

  const today = todayISO();
  const first = monthStart(today);

  // Personal views are always scoped to the current user — even for admins,
  // whose RLS would otherwise return everyone's logs. (The /admin timesheet is
  // the place that shows all users.)
  const { data: monthLogs } = await supabase
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("work_date", first)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });

  const { data: recent } = await supabase
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(15);

  const month = (monthLogs ?? []) as TimeLog[];
  const sum = (rows: TimeLog[]) =>
    rows.reduce((acc, r) => acc + durationHours(r.start_time, r.end_time), 0);

  const todayTotal = sum(month.filter((r) => r.work_date === today));
  const monthTotal = sum(month);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">
          {profile.full_name
            ? t(lang, "dash.greeting", { name: profile.full_name })
            : t(lang, "dash.greetingNoName")}
        </h1>
        <p className="text-base text-fg-muted">{t(lang, "dash.subtitle")}</p>
      </div>

      <SummaryCards
        todayHours={todayTotal}
        monthHours={monthTotal}
        entriesThisMonth={month.length}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <LogForm maxDate={today} />
        <RecentLogs logs={(recent ?? []) as TimeLog[]} />
      </div>
    </div>
  );
}
