import type { TimeLogWithProfile } from "./types";
import { durationHours, formatHoursLabel, hhmm } from "./time";
import { t, type Lang } from "./i18n";

/** Escape a single CSV cell (RFC 4180: quote if it contains , " or newline). */
function cell(value: string | number): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build a payroll CSV string from filtered logs, localized to `lang`. Prefixed
 * with a UTF-8 BOM so Excel opens Hebrew (and other UTF-8) correctly.
 */
export function buildCsv(rows: TimeLogWithProfile[], lang: Lang): string {
  const headers = [
    t(lang, "csv.employee"),
    t(lang, "csv.role"),
    t(lang, "csv.date"),
    t(lang, "csv.start"),
    t(lang, "csv.end"),
    t(lang, "csv.hoursDecimal"),
    t(lang, "csv.hoursHM"),
    t(lang, "csv.description"),
  ];
  const roleLabel = (r: string | undefined) =>
    t(lang, r === "admin" ? "role.admin" : "role.employee");

  const lines = [headers.map(cell).join(",")];
  for (const r of rows) {
    const hours = durationHours(r.start_time, r.end_time);
    lines.push(
      [
        cell(r.profiles?.full_name ?? ""),
        cell(roleLabel(r.profiles?.role)),
        cell(r.work_date),
        cell(hhmm(r.start_time)),
        cell(hhmm(r.end_time)),
        cell(hours.toFixed(2)),
        cell(formatHoursLabel(hours)),
        cell(r.description ?? ""),
      ].join(",")
    );
  }
  return "﻿" + lines.join("\r\n");
}

/** Trigger a client-side download of `content` as `filename`. */
export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
