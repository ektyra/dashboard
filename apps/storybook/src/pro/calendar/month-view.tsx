import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "../../lib/cn";
import type { CalendarEvent } from "./calendar-data";
import { eventsOnDay, isSameDay } from "./calendar-utils";
import { EventChip } from "./event-chip";

const MAX_CHIPS = 3;

type MonthViewProps = Readonly<{
  anchor: Date;
  events: CalendarEvent[];
  today: Date | undefined;
  onOpenEvent: (event: CalendarEvent) => void;
  onCreate: (day: Date) => void;
  onOpenDay: (day: Date) => void;
}>;

/** A month as a grid of days, weeks starting on Monday. */
export function MonthView({
  anchor,
  events,
  today,
  onOpenEvent,
  onCreate,
  onOpenDay,
}: MonthViewProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 }),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-xs text-muted-foreground">
        {days.slice(0, 7).map((day) => (
          <div key={day.getDay()} className="px-2 py-2 text-center">
            {format(day, "EEE")}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = eventsOnDay(events, day);
          const isToday = today !== undefined && isSameDay(day, today);
          return (
            // The cell is a button-like area: clicking empty space starts a new event on that day.
            <div
              key={day.toISOString()}
              role="gridcell"
              tabIndex={0}
              aria-label={`${format(day, "EEEE d MMMM")}, ${dayEvents.length} events. Press Enter to add an event.`}
              onClick={() => onCreate(day)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && event.target === event.currentTarget) onCreate(day);
              }}
              className={cn(
                "min-h-28 cursor-pointer border-border p-1.5 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                index % 7 !== 6 && "border-r",
                index < days.length - 7 && "border-b",
                !isSameMonth(day, anchor) && "bg-muted/20 text-muted-foreground",
              )}
            >
              <div className="mb-1 flex justify-end">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-xs tabular-nums",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="grid gap-0.5">
                {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                  <EventChip key={event.id} event={event} onOpen={onOpenEvent} />
                ))}
                {dayEvents.length > MAX_CHIPS && (
                  <button
                    type="button"
                    onClick={(click) => {
                      click.stopPropagation();
                      onOpenDay(day);
                    }}
                    className="cursor-pointer rounded px-1.5 text-left text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    +{dayEvents.length - MAX_CHIPS} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
