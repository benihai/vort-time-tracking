import * as React from "react";
import { cn } from "@/lib/utils";

// Label + control wrapper. Label uses the eyebrow treatment (uppercase-ish,
// but kept sentence-case for Hebrew) at text-sm, secondary color.
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-fg-secondary"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}
