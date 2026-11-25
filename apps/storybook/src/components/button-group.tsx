import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type ButtonGroupProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

/**
 * Joins buttons into one segmented control: shared borders, only the outer
 * corners are rounded. Put `Button`s (usually `variant="outline"`) inside it.
 */
export function ButtonGroup({
  orientation = "horizontal",
  className,
  role = "group",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit",
        orientation === "horizontal"
          ? "flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none"
          : "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
        "[&>*:focus-visible]:z-10",
        className,
      )}
      {...props}
    />
  );
}
