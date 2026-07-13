"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { durationHours, formatHoursLabel, hhmm, todayISO } from "@/lib/time";
import { useLang } from "@/components/LangProvider";
import type { TimeLog } from "@/lib/types";

// "My reports": pick a month, see every entry for it + the monthly total.
// Filters a preloaded list client-side (instant, no round-trips).
export function MonthReport({ logs }: { logs: TimeLog[] }) {
  const { t } = useLang();
  const [month, setMonth] = useState(todayISO().slice(0, 7)); // YYYY-MM

  const rows = useMemo(
    () =>
      logs
        .filter((l) => l.work_date.startsWith(month))
        .sort((a, b) =>
          a.work_date === b.work_date
            ? a.start_time.localeCompare(b.start_time)
            : a.work_date.localeCompare(b.work_date)
        ),
    [logs, month]
  );

  const total = rows.reduce(
    (acc, r) => acc + durationHours(r.start_time, r.end_time),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Field label={t("history.month")} htmlFor="month" className="w-full max-w-[200px]">
            <Input
              id="month"
              type="month"
              dir="ltr"
              value={month}
              max={todayISO().slice(0, 7)}
              onChange={(e) => setMonth(e.target.value)}
            />
          </Field>
          <div className="flex items-center gap-2 rounded-lg bg-primary-light px-4 py-2 text-primary">
            <CalendarDays size={18} strokeWidth={1.75} />
            <span className="text-sm font-medium">{t("history.total")}:</span>
            <span className="num font-heading text-lg font-extrabold">
              {formatHoursLabel(total)}
            </span>
            <span className="num text-sm">({total.toFixed(2)})</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-xs font-semibold text-fg-secondary">
                <th className="px-4 py-3 text-start font-semibold">{t("th.date")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.hours")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.total")}</th>
                <th className="px-4 py-3 text-start font-semibold">
                  {t("th.description")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-base text-fg-muted"
                  >
                    {t("history.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border last:border-0 hover:bg-surface-alt/50"
                  >
                    <td className="num px-4 py-3 text-sm font-medium text-fg">
                      {r.work_date}
                    </td>
                    <td className="num px-4 py-3 text-sm text-fg-secondary">
                      {hhmm(r.start_time)}–{hhmm(r.end_time)}
                    </td>
                    <td className="num px-4 py-3 text-sm font-semibold text-fg">
                      {formatHoursLabel(durationHours(r.start_time, r.end_time))}
                    </td>
                    <td className="max-w-[280px] px-4 py-3 text-sm text-fg-muted">
                      <span className="line-clamp-2">{r.description || "—"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
