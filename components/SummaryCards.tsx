"use client";

import { Clock, CalendarDays, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatHoursLabel } from "@/lib/time";
import { useLang } from "@/components/LangProvider";

// Stat cards (§10.2 flavour). Big number in the display face, coral reserved
// as the single accent per card via the icon chip.
function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card hover className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm text-fg-muted">{label}</div>
        <div className="num font-heading text-2xl font-extrabold leading-none text-fg">
          {value}
        </div>
        <div className="mt-1 text-xs text-fg-muted">{sub}</div>
      </div>
    </Card>
  );
}

export function SummaryCards({
  todayHours,
  monthHours,
  entriesThisMonth,
}: {
  todayHours: number;
  monthHours: number;
  entriesThisMonth: number;
}) {
  const { t } = useLang();
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat
        icon={<Clock size={20} strokeWidth={1.75} />}
        label={t("stat.today")}
        value={formatHoursLabel(todayHours)}
        sub={`${todayHours.toFixed(2)} ${t("stat.hours")}`}
      />
      <Stat
        icon={<CalendarDays size={20} strokeWidth={1.75} />}
        label={t("stat.month")}
        value={formatHoursLabel(monthHours)}
        sub={`${monthHours.toFixed(2)} ${t("stat.hours")}`}
      />
      <Stat
        icon={<ListChecks size={20} strokeWidth={1.75} />}
        label={t("stat.entries")}
        value={String(entriesThisMonth)}
        sub={t("stat.records")}
      />
    </div>
  );
}
