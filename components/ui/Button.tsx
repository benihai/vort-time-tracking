import * as React from "react";
import { cn } from "@/lib/utils";

// §11.1 Button. Primary is the single coral action per screen (§4.8).
type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md " +
  "transition-colors duration-fast ease-out focus-ring disabled:opacity-50 " +
  "disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-transparent border border-border text-fg hover:bg-surface-alt",
  ghost: "bg-transparent text-fg-muted hover:bg-surface-alt hover:text-fg",
  destructive:
    "bg-transparent border border-border text-destructive hover:bg-[#fef2f2]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  sm: "h-8 px-3 text-xs",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
