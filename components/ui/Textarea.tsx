import * as React from "react";
import { cn } from "@/lib/utils";

// Textarea — Input styling extended vertically.
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[80px] w-full rounded-sm border border-input bg-surface px-3 py-2 text-base text-fg",
      "placeholder:text-fg-placeholder transition-colors duration-fast ease-out",
      "focus-ring resize-y disabled:opacity-60",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
