// Time / duration helpers. Inputs are "HH:MM" 24-hour strings and "YYYY-MM-DD".

/** Minutes since midnight for an "HH:MM" (or "HH:MM:SS") string. */
export function toMinutes(t: string): number {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
}

/** Duration in hours (decimal) between two "HH:MM" times on the same day. */
export function durationHours(start: string, end: string): number {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

/** "8.5" -> "8:30" style H:MM label. */
export function formatHoursLabel(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** Local YYYY-MM-DD for "today" (avoids UTC off-by-one from toISOString). */
export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** First day (YYYY-MM-DD) of the month containing `iso`. */
export function monthStart(iso: string): string {
  return iso.slice(0, 7) + "-01";
}

/** Trim "HH:MM:SS" from Postgres `time` to "HH:MM" for display. */
export function hhmm(t: string): string {
  return t.slice(0, 5);
}

/** True when `t` is a valid 24-hour "HH:MM" string. */
export function isValidTime(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}

/** Best-effort normalization of loose input to "HH:MM" (e.g. "930" -> "09:30",
 * "9:5" -> "09:05", "9" -> "09:00"). Leaves unrecognized input untouched. */
export function normalizeTime(raw: string): string {
  const s = raw.trim();
  if (s === "") return "";

  let m = s.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2].padStart(2, "0")}`;

  m = s.match(/^(\d{3,4})$/);
  if (m) {
    const d = m[1];
    return `${d.slice(0, -2).padStart(2, "0")}:${d.slice(-2)}`;
  }

  m = s.match(/^(\d{1,2})$/);
  if (m) return `${m[1].padStart(2, "0")}:00`;

  return s;
}
