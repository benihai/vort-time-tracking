"use client";

import { useEffect, useState } from "react";
import { MonthReport } from "@/components/MonthReport";
import { useAuth } from "@/components/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { fetchMyLogs } from "@/lib/api";
import type { TimeLog } from "@/lib/types";

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [logs, setLogs] = useState<TimeLog[]>([]);

  useEffect(() => {
    if (user) fetchMyLogs(user.id).then(setLogs);
  }, [user]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t("history.title")}</h1>
        <p className="text-base text-fg-muted">{t("history.subtitle")}</p>
      </div>
      <MonthReport logs={logs} />
    </div>
  );
}
