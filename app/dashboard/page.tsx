"use client";

import { useCallback, useEffect, useState } from "react";
import { LogForm } from "@/components/LogForm";
import { SummaryCards } from "@/components/SummaryCards";
import { RecentLogs } from "@/components/RecentLogs";
import { useAuth } from "@/components/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { fetchMyLogs } from "@/lib/api";
import { durationHours, monthStart, todayISO } from "@/lib/time";
import type { TimeLog } from "@/lib/types";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLang();
  const [monthLogs, setMonthLogs] = useState<TimeLog[]>([]);
  const [recent, setRecent] = useState<TimeLog[]>([]);

  const today = todayISO();

  const load = useCallback(async () => {
    if (!user) return;
    const [month, all] = await Promise.all([
      fetchMyLogs(user.id, { from: monthStart(today) }),
      fetchMyLogs(user.id),
    ]);
    setMonthLogs(month);
    setRecent(all.slice(0, 15));
  }, [user, today]);

  useEffect(() => {
    load();
  }, [load]);

  const sum = (rows: TimeLog[]) =>
    rows.reduce((acc, r) => acc + durationHours(r.start_time, r.end_time), 0);
  const todayTotal = sum(monthLogs.filter((r) => r.work_date === today));
  const monthTotal = sum(monthLogs);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">
          {profile?.full_name
            ? t("dash.greeting", { name: profile.full_name })
            : t("dash.greetingNoName")}
        </h1>
        <p className="text-base text-fg-muted">{t("dash.subtitle")}</p>
      </div>

      <SummaryCards
        todayHours={todayTotal}
        monthHours={monthTotal}
        entriesThisMonth={monthLogs.length}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <LogForm maxDate={today} userId={user?.id ?? ""} onSaved={load} />
        <RecentLogs logs={recent} userId={user?.id ?? ""} onChanged={load} />
      </div>
    </div>
  );
}
