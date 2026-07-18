"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { TimeInput } from "@/components/ui/TimeInput";
import { useLang } from "@/components/LangProvider";
import { updateLog } from "@/lib/api";
import {
  durationHours,
  formatHoursLabel,
  hhmm,
  isValidTime,
  normalizeTime,
} from "@/lib/time";
import type { TimeLog } from "@/lib/types";

// Inline editor for one existing log. Same validation as creating a new one.
export function EditLogForm({
  log,
  userId,
  maxDate,
  onDone,
  onCancel,
}: {
  log: TimeLog;
  userId: string;
  maxDate: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { t } = useLang();
  const [date, setDate] = useState(log.work_date);
  const [start, setStart] = useState(hhmm(log.start_time));
  const [end, setEnd] = useState(hhmm(log.end_time));
  const [description, setDescription] = useState(log.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const preview =
    start && end && start < end ? formatHoursLabel(durationHours(start, end)) : null;

  async function onSave() {
    setError(null);
    const s = normalizeTime(start);
    const en = normalizeTime(end);
    setStart(s);
    setEnd(en);
    if (!isValidTime(s) || !isValidTime(en)) return setError(t("err.timeFormat"));

    setLoading(true);
    const res = await updateLog({
      id: log.id,
      userId,
      work_date: date,
      start_time: s,
      end_time: en,
      description,
    });
    setLoading(false);
    if (!res.ok) return setError(t(res.key));
    onDone();
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-md border border-border bg-surface-alt/60 p-4">
      <div className="text-sm font-semibold text-fg-secondary">
        {t("form.editTitle")}
      </div>

      <Field label={t("form.date")} htmlFor={`d-${log.id}`}>
        <Input
          id={`d-${log.id}`}
          type="date"
          dir="ltr"
          max={maxDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.start")} htmlFor={`s-${log.id}`}>
          <TimeInput id={`s-${log.id}`} value={start} onChange={setStart} />
        </Field>
        <Field label={t("form.end")} htmlFor={`e-${log.id}`}>
          <TimeInput id={`e-${log.id}`} value={end} onChange={setEnd} />
        </Field>
      </div>

      {preview && (
        <div className="rounded-sm bg-surface px-3 py-2 text-sm text-fg-secondary">
          {t("form.total")}{" "}
          <span className="num font-semibold text-fg">{preview}</span>{" "}
          {t("form.hours")}
        </div>
      )}

      <Field label={t("form.description")} htmlFor={`desc-${log.id}`}>
        <Textarea
          id={`desc-${log.id}`}
          value={description}
          maxLength={500}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-sm bg-[#fef2f2] px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle size={16} strokeWidth={1.75} />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={onSave} disabled={loading} size="sm">
          {loading && <Loader2 size={16} className="animate-spin" strokeWidth={1.75} />}
          {loading ? t("form.saving") : t("form.saveChanges")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          {t("form.cancel")}
        </Button>
      </div>
    </div>
  );
}
