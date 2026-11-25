import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/**
 * A bento grid: tiles of different sizes that fit together. One column on a
 * phone, six on a tablet, twelve on a wide screen. Give each tile its span with
 * classes such as `md:col-span-3 xl:col-span-4`.
 */
export function Bento({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch gap-4 md:grid-cols-6 xl:grid-cols-12",
        className,
      )}
      {...props}
    />
  );
}
