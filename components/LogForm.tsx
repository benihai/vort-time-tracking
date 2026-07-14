"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus } from "lucide-react";
import { addLog } from "@/lib/api";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { TimeInput } from "@/components/ui/TimeInput";
import {
  durationHours,
  formatHoursLabel,
  isValidTime,
  normalizeTime,
} from "@/lib/time";
import { useLang } from "@/components/LangProvider";

export function LogForm({
  maxDate,
  userId,
  onSaved,
}: {
  maxDate: string;
  userId: string;
  onSaved: () => void;
}) {
  const { t } = useLang();
  const [date, setDate] = useState(maxDate);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    { type: "error" | "ok"; msg: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  const preview =
    start && end && start < end ? formatHoursLabel(durationHours(start, end)) : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    // Normalize loose input ("915" -> "09:15") and validate before sending —
    // don't rely on the blur handler having fired first.
    const s = normalizeTime(start);
    const en = normalizeTime(end);
    setStart(s);
    setEnd(en);

    if ((start && !isValidTime(s)) || (end && !isValidTime(en))) {
      setStatus({ type: "error", msg: t("err.timeFormat") });
      return;
    }

    setLoading(true);
    const result = await addLog({
      userId,
      work_date: date,
      start_time: s,
      end_time: en,
      description,
    });
    setLoading(false);

    if (!result.ok) {
      setStatus({ type: "error", msg: t(result.key) });
      return;
    }
    setStatus({ type: "ok", msg: t("form.success") });
    setStart("");
    setEnd("");
    setDescription("");
    onSaved();
  }

  return (
    <Card>
      <CardTitle className="mb-4">{t("form.title")}</CardTitle>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label={t("form.date")} htmlFor="work_date" hint={t("form.dateHint")}>
          <Input
            id="work_date"
            name="work_date"
            type="date"
            dir="ltr"
            max={maxDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("form.start")} htmlFor="start_time">
            <TimeInput id="start_time" value={start} onChange={setStart} />
          </Field>
          <Field label={t("form.end")} htmlFor="end_time">
            <TimeInput id="end_time" value={end} onChange={setEnd} />
          </Field>
        </div>

        {preview && (
          <div className="rounded-sm bg-surface-alt px-3 py-2 text-sm text-fg-secondary">
            {t("form.total")}{" "}
            <span className="num font-semibold text-fg">{preview}</span>{" "}
            {t("form.hours")}
          </div>
        )}

        <Field label={t("form.description")} htmlFor="description">
          <Textarea
            id="description"
            name="description"
            placeholder={t("form.descriptionPlaceholder")}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        {status && (
          <div
            role={status.type === "error" ? "alert" : "status"}
            className={
              status.type === "error"
                ? "flex items-center gap-2 rounded-sm bg-[#fef2f2] px-3 py-2 text-sm text-destructive"
                : "flex items-center gap-2 rounded-sm bg-[#f0fdf4] px-3 py-2 text-sm text-[#15803d]"
            }
          >
            {status.type === "error" ? (
              <AlertCircle size={16} strokeWidth={1.75} />
            ) : (
              <CheckCircle2 size={16} strokeWidth={1.75} />
            )}
            {status.msg}
          </div>
        )}

        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading ? (
            <Loader2 size={16} className="animate-spin" strokeWidth={1.75} />
          ) : (
            <Plus size={16} strokeWidth={1.75} />
          )}
          {loading ? t("form.saving") : t("form.save")}
        </Button>
      </form>
    </Card>
  );
}
