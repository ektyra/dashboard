import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** Small helper text under an image, chart or field. Use inside `<figcaption>` when it captions a figure. */
export function Caption({ className, ...props }: ComponentProps<"span">) {
  return (
    <span className={cn("block text-xs leading-5 text-muted-foreground", className)} {...props} />
  );
}
