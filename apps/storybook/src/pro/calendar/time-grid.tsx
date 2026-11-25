import { useEffect, useRef } from "react";
import { format, startOfDay } from "date-fns";
import { cn } from "../../lib/cn";
import { categoryById } from "./calendar-data";
import type { CalendarEvent } from "./calendar-data";
import { eventsOnDay, isSameDay, layoutDay } from "./calendar-utils";
import { EventChip } from "./event-chip";

const HOUR_HEIGHT = 48;
const hours = Array.from({ length: 24 }, (_, hour) => hour);

type TimeGridProps = Readonly<{
  days: Date[];
  events: CalendarEvent[];
  today: Date | undefined;
  onOpenEvent: (event: CalendarEvent) => void;
  /** Clicked an empty spot: the day and the hour (with minutes in 30-minute steps). */
  onCreate: (day: Date, minutes: number) => void;
}>;

/** One or more days as columns, with hours down the side. Used for the week and day views. */
export function TimeGrid({ days, events, today, onOpenEvent, onCreate }: TimeGridProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const columns = `3.5rem repeat(${days.length}, minmax(0, 1fr))`;

  // Start the view at 08:00 so the working day is visible without scrolling.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 8 * HOUR_HEIGHT - 8 });
  }, []);

  const allDay = days.map((day) => eventsOnDay(events, day).filter((event) => event.allDay));
  const hasAllDay = allDay.some((list) => list.length > 0);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="grid border-b border-border bg-muted/40"
        style={{ gridTemplateColumns: columns }}
      >
        <div />
        {days.map((day) => {
          const isToday = today !== undefined && isSameDay(day, today);
          return (
            <div key={day.toISOString()} className="border-l border-border px-2 py-2 text-center">
              <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
              <p
                className={cn(
                  "mx-auto mt-0.5 grid size-7 place-items-center rounded-full text-sm tabular-nums",
                  isToday && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </p>
            </div>
          );
        })}
      </div>
      {hasAllDay && (
        <div className="grid border-b border-border" style={{ gridTemplateColumns: columns }}>
          <div className="px-1 py-1.5 text-right text-[0.65rem] text-muted-foreground">All day</div>
          {allDay.map((list, index) => (
            <div
              key={days[index]?.toISOString()}
              className="grid content-start gap-0.5 border-l border-border p-1"
            >
              {list.map((event) => (
                <EventChip key={event.id} event={event} onOpen={onOpenEvent} />
              ))}
            </div>
          ))}
        </div>
      )}
      <div ref={scroller} className="max-h-[36rem] overflow-y-auto">
        <div
          className="relative grid"
          style={{ gridTemplateColumns: columns, height: HOUR_HEIGHT * 24 }}
        >
          <div className="relative">
            {hours.slice(1).map((hour) => (
              <span
                key={hour}
                className="absolute right-2 -translate-y-1/2 text-[0.65rem] text-muted-foreground tabular-nums"
                style={{ top: hour * HOUR_HEIGHT }}
              >
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {days.map((day) => {
            const placed = layoutDay(eventsOnDay(events, day), day);
            const isToday = today !== undefined && isSameDay(day, today);
            const minutesNow = today ? today.getHours() * 60 + today.getMinutes() : 0;
            return (
              <div
                key={day.toISOString()}
                role="gridcell"
                aria-label={`${format(day, "EEEE d MMMM")}. Click to add an event.`}
                className="relative cursor-pointer border-l border-border"
                style={{
                  backgroundImage: "linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: `100% ${HOUR_HEIGHT}px`,
                }}
                onClick={(click) => {
                  const rect = click.currentTarget.getBoundingClientRect();
                  const minutes = Math.floor((click.clientY - rect.top) / (HOUR_HEIGHT / 2)) * 30;
                  onCreate(startOfDay(day), minutes);
                }}
              >
                {placed.map(({ event, top, height, column, columns: count }) => {
                  const category = categoryById(event.category);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(click) => {
                        click.stopPropagation();
                        onOpenEvent(event);
                      }}
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        left: `calc(${(column / count) * 100}% + 2px)`,
                        width: `calc(${100 / count}% - 4px)`,
                      }}
                      className={cn(
                        "absolute cursor-pointer overflow-hidden rounded-md border-l-2 px-1.5 py-1 text-left text-xs outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring",
                        category.chip,
                      )}
                    >
                      <p className="truncate">{event.title}</p>
                      <p className="truncate text-[0.65rem] text-muted-foreground tabular-nums">
                        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
                      </p>
                    </button>
                  );
                })}
                {isToday && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 z-10 h-px bg-destructive"
                    style={{ top: `${(minutesNow / (24 * 60)) * 100}%` }}
                  >
                    <span className="absolute -top-1 -left-1 size-2 rounded-full bg-destructive" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
