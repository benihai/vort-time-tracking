"use client";

import { useState } from "react";
import { Trash2, Clock3 } from "lucide-react";
import { deleteLog } from "@/lib/api";
import { Card, CardTitle } from "@/components/ui/Card";
import { durationHours, formatHoursLabel, hhmm } from "@/lib/time";
import { useLang } from "@/components/LangProvider";
import type { TimeLog } from "@/lib/types";

export function RecentLogs({
  logs,
  userId,
  onChanged,
}: {
  logs: TimeLog[];
  userId: string;
  onChanged: () => void;
}) {
  const { t } = useLang();
  const [busyId, setBusyId] = useState<string | null>(null);
  const pending = busyId !== null;

  async function onDelete(id: string) {
    if (!confirm(t("recent.confirmDelete"))) return;
    setBusyId(id);
    await deleteLog(id, userId);
    setBusyId(null);
    onChanged();
  }

  return (
    <Card>
      <CardTitle className="mb-4">{t("recent.title")}</CardTitle>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Clock3 size={28} strokeWidth={1.5} className="text-fg-placeholder" />
          <p className="text-base text-fg-muted">{t("recent.empty")}</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {logs.map((log) => (
            <li key={log.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="num text-sm font-semibold text-fg">
                    {log.work_date}
                  </span>
                  <span className="num text-sm text-fg-muted">
                    {hhmm(log.start_time)}–{hhmm(log.end_time)}
                  </span>
                </div>
                {log.description && (
                  <p className="mt-0.5 truncate text-sm text-fg-muted">
                    {log.description}
                  </p>
                )}
              </div>

              <span className="num shrink-0 rounded-full bg-surface-alt px-2.5 py-1 text-xs font-semibold text-fg-secondary">
                {formatHoursLabel(durationHours(log.start_time, log.end_time))}
              </span>

              <button
                type="button"
                aria-label={t("recent.delete")}
                onClick={() => onDelete(log.id)}
                disabled={pending && busyId === log.id}
                className="rounded-md p-2 text-fg-muted transition-colors duration-fast hover:bg-surface-alt hover:text-destructive disabled:opacity-50"
              >
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
