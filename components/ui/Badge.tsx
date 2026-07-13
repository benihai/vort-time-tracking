import * as React from "react";
import { cn } from "@/lib/utils";

// §11.4 Badge. Pill, text-xs, brand / neutral tones.
type Tone = "brand" | "neutral" | "success" | "warning";

const tones: Record<Tone, string> = {
  brand: "bg-primary-light text-primary",
  neutral: "bg-surface-alt text-fg-secondary",
  success: "bg-[#dcfce7] text-[#15803d]",
  warning: "bg-[#fef3c7] text-[#b45309]",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full px-2.5 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
