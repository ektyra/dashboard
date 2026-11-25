import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** A pulsing placeholder. Give it a size with className. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
