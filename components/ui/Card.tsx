import * as React from "react";
import { cn } from "@/lib/utils";

// §11.3 Card. radius-lg (12px), shadow-sm at rest -> shadow-md on hover.
export function Card({
  className,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-sm",
        hover && "transition-shadow duration-normal ease-out hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg text-fg", className)} {...props} />;
}

export function CardSubtitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-fg-muted font-body", className)}
      {...props}
    />
  );
}
