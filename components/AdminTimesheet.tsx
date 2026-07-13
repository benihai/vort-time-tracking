"use client";

import { useMemo, useState } from "react";
import { Download, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { buildCsv, downloadCsv } from "@/lib/csv";
import { durationHours, formatHoursLabel, hhmm, todayISO } from "@/lib/time";
import { useLang } from "@/components/LangProvider";
import type { Profile, Role, TimeLogWithProfile } from "@/lib/types";

type Filters = {
  employeeId: string; // "" = all
  role: "" | Role;
  from: string;
  to: string;
};

const emptyFilters: Filters = { employeeId: "", role: "", from: "", to: "" };

export function AdminTimesheet({
  rows,
  employees,
}: {
  rows: TimeLogWithProfile[];
  employees: Profile[];
}) {
  const { t, lang } = useLang();
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.full_name || "";

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filters.employeeId && r.user_id !== filters.employeeId) return false;
      if (filters.role && r.profiles?.role !== filters.role) return false;
      if (filters.from && r.work_date < filters.from) return false;
      if (filters.to && r.work_date > filters.to) return false;
      return true;
    });
  }, [rows, filters]);

  const totalHours = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => acc + durationHours(r.start_time, r.end_time),
        0
      ),
    [filtered]
  );

  const active =
    filters.employeeId || filters.role || filters.from || filters.to;

  function onExport() {
    const stamp = todayISO();
    const who = filters.employeeId
      ? employeeName(filters.employeeId).replace(/\s+/g, "_")
      : "all";
    downloadCsv(`vort_timesheet_${who}_${stamp}.csv`, buildCsv(filtered, lang));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-fg-secondary">
          <Filter size={16} strokeWidth={1.75} />
          {t("filter.title")}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t("filter.employee")} htmlFor="f-emp">
            <select
              id="f-emp"
              value={filters.employeeId}
              onChange={(e) => set("employeeId", e.target.value)}
              className="focus-ring h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-fg"
            >
              <option value="">{t("filter.allEmployees")}</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name || t("users.noName")}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("filter.role")} htmlFor="f-role">
            <select
              id="f-role"
              value={filters.role}
              onChange={(e) => set("role", e.target.value as "" | Role)}
              className="focus-ring h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-fg"
            >
              <option value="">{t("filter.all")}</option>
              <option value="employee">{t("role.employee")}</option>
              <option value="admin">{t("role.admin")}</option>
            </select>
          </Field>

          <Field label={t("filter.from")} htmlFor="f-from">
            <Input
              id="f-from"
              type="date"
              dir="ltr"
              value={filters.from}
              onChange={(e) => set("from", e.target.value)}
            />
          </Field>

          <Field label={t("filter.to")} htmlFor="f-to">
            <Input
              id="f-to"
              type="date"
              dir="ltr"
              value={filters.to}
              onChange={(e) => set("to", e.target.value)}
            />
          </Field>
        </div>

        {active && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="mt-3 inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
          >
            <X size={14} strokeWidth={1.75} />
            {t("filter.clear")}
          </button>
        )}
      </Card>

      {/* Summary + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-secondary">
          <span>{t("admin.entriesCount", { n: filtered.length })}</span>
          <span>
            {t("admin.totalHours", { h: formatHoursLabel(totalHours) })}
            <span className="num text-fg-muted"> ({totalHours.toFixed(2)})</span>
          </span>
        </div>
        <Button onClick={onExport} disabled={filtered.length === 0} size="sm">
          <Download size={16} strokeWidth={1.75} />
          {t("admin.export")}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-start">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-start text-xs font-semibold text-fg-secondary">
                <th className="px-4 py-3 text-start font-semibold">{t("th.employee")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.role")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.date")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.hours")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.total")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("th.description")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-base text-fg-muted"
                  >
                    {t("admin.tableEmpty")}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border last:border-0 hover:bg-surface-alt/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-fg">
                      {r.profiles?.full_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={r.profiles?.role === "admin" ? "brand" : "neutral"}>
                        {t(r.profiles?.role === "admin" ? "role.admin" : "role.employee")}
                      </Badge>
                    </td>
                    <td className="num px-4 py-3 text-sm text-fg-secondary">
                      {r.work_date}
                    </td>
                    <td className="num px-4 py-3 text-sm text-fg-secondary">
                      {hhmm(r.start_time)}–{hhmm(r.end_time)}
                    </td>
                    <td className="num px-4 py-3 text-sm font-semibold text-fg">
                      {formatHoursLabel(durationHours(r.start_time, r.end_time))}
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-sm text-fg-muted">
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
