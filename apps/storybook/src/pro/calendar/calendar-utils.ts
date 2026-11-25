import {
  addDays,
  areIntervalsOverlapping,
  differenceInMinutes,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import type { CalendarEvent } from "./calendar-data";

/** Events that touch a given day, all-day ones first, then by start time. */
export function eventsOnDay(events: CalendarEvent[], day: Date) {
  const interval = { start: startOfDay(day), end: endOfDay(day) };
  return events
    .filter((event) =>
      areIntervalsOverlapping({ start: event.start, end: event.end }, interval, {
        inclusive: true,
      }),
    )
    .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.start.getTime() - b.start.getTime());
}

export type Positioned = {
  event: CalendarEvent;
  top: number;
  height: number;
  column: number;
  columns: number;
};

const MINUTES_IN_DAY = 24 * 60;

/**
 * Where timed events go in a day column: vertical position as a percentage of the
 * day, plus a column number so events that overlap sit side by side.
 */
export function layoutDay(events: CalendarEvent[], day: Date): Positioned[] {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  const timed = events
    .filter((event) => !event.allDay)
    .map((event) => {
      const start = event.start < dayStart ? dayStart : event.start;
      const end = event.end > dayEnd ? dayEnd : event.end;
      return { event, start, end };
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Group events that overlap each other, then give each one a column inside its group.
  const groups: (typeof timed)[] = [];
  let groupEnd = 0;
  for (const item of timed) {
    const last = groups[groups.length - 1];
    if (last && item.start.getTime() < groupEnd) {
      last.push(item);
      groupEnd = Math.max(groupEnd, item.end.getTime());
    } else {
      groups.push([item]);
      groupEnd = item.end.getTime();
    }
  }

  return groups.flatMap((group) => {
    const columnEnds: number[] = [];
    const placed = group.map((item) => {
      let column = columnEnds.findIndex((end) => end <= item.start.getTime());
      if (column === -1) column = columnEnds.length;
      columnEnds[column] = item.end.getTime();
      return { item, column };
    });
    return placed.map(({ item, column }) => ({
      event: item.event,
      column,
      columns: columnEnds.length,
      top: (differenceInMinutes(item.start, dayStart) / MINUTES_IN_DAY) * 100,
      height: Math.max(
        (differenceInMinutes(item.end, item.start) / MINUTES_IN_DAY) * 100,
        (20 / MINUTES_IN_DAY) * 100,
      ),
    }));
  });
}

export { isSameDay };
