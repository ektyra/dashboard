import type { ComponentProps } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";

/**
 * A month calendar (react-day-picker). Pass `mode="single"`, `"multiple"` or
 * `"range"` with `selected` and `onSelect`, as the library documents.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const navButton = cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8");
  const dayButton = "size-9 rounded-md transition-colors hover:bg-muted";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-8 items-center justify-center px-9 text-sm",
        caption_label: "text-sm",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: navButton,
        button_next: navButton,
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs text-muted-foreground",
        week: "mt-1 flex",
        day: "relative size-9 p-0 text-center text-sm",
        day_button: `${dayButton} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        today: "[&>button]:text-primary [&>button]:ring-1 [&>button]:ring-primary/40",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary",
        range_start: "[&>button]:rounded-r-none",
        range_end: "[&>button]:rounded-l-none",
        range_middle:
          "[&>button]:rounded-none [&>button]:bg-accent [&>button]:text-accent-foreground [&>button:hover]:bg-accent",
        outside: "text-muted-foreground/50",
        disabled: "opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", chevronClass)} aria-hidden="true" />
          ) : (
            <ChevronRight className={cn("size-4", chevronClass)} aria-hidden="true" />
          ),
      }}
      {...props}
    />
  );
}
