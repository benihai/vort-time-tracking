"use client";

import { useEffect, useState } from "react";
import { AdminTimesheet } from "@/components/AdminTimesheet";
import { useLang } from "@/components/LangProvider";
import { fetchAllLogs, fetchProfiles } from "@/lib/api";
import type { Profile, TimeLogWithProfile } from "@/lib/types";

export default function AdminTimesheetPage() {
  const { t } = useLang();
  const [rows, setRows] = useState<TimeLogWithProfile[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);

  useEffect(() => {
    fetchAllLogs().then(setRows);
    fetchProfiles().then(setEmployees);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl text-fg">{t("admin.title")}</h1>
        <p className="text-base text-fg-muted">{t("admin.subtitle")}</p>
      </div>
      <AdminTimesheet rows={rows} employees={employees} />
    </div>
  );
}
