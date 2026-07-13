import * as React from "react";
import { cn } from "@/lib/utils";

// §11.2 Input. h-10, radius-sm, focus ring via .focus-ring.
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-fg",
      "placeholder:text-fg-placeholder transition-colors duration-fast ease-out",
      "focus-ring disabled:opacity-60",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
