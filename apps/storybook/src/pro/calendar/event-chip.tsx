import { format } from "date-fns";
import { cn } from "../../lib/cn";
import { categoryById } from "./calendar-data";
import type { CalendarEvent } from "./calendar-data";

/** A small event label for a month cell. A coloured edge shows the category. */
export function EventChip({
  event,
  onOpen,
}: Readonly<{ event: CalendarEvent; onOpen: (event: CalendarEvent) => void }>) {
  const category = categoryById(event.category);
  return (
    <button
      type="button"
      onClick={(click) => {
        click.stopPropagation();
        onOpen(event);
      }}
      title={`${event.title}${event.allDay ? "" : `, ${format(event.start, "HH:mm")}`}`}
      className={cn(
        "flex w-full min-w-0 cursor-pointer items-center gap-1 rounded-sm border-l-2 px-1.5 py-0.5 text-left text-xs outline-none transition-colors hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring",
        category.chip,
      )}
    >
      {!event.allDay && (
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {format(event.start, "HH:mm")}
        </span>
      )}
      <span className="truncate">{event.title}</span>
    </button>
  );
}
