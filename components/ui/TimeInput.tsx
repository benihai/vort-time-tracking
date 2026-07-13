"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { isValidTime, normalizeTime } from "@/lib/time";

// 24-hour time field. Type any HH:MM freely, OR pick from the datalist
// suggestions (every 15 min). Never shows AM/PM. Auto-formats on blur
// ("930" -> "09:30", "9:5" -> "09:05") and flags invalid input.
const SUGGESTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});

export function TimeInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  const listId = useId();
  const invalid = value !== "" && !isValidTime(value);

  return (
    <>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        dir="ltr"
        list={listId}
        placeholder="HH:MM"
        maxLength={5}
        aria-invalid={invalid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onChange(normalizeTime(e.target.value))}
        className={cn(
          "num h-10 w-full rounded-sm border bg-surface px-3 text-center text-base text-fg",
          "placeholder:text-fg-placeholder transition-colors duration-fast ease-out focus-ring",
          invalid ? "border-destructive" : "border-input"
        )}
      />
      <datalist id={listId}>
        {SUGGESTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
}
