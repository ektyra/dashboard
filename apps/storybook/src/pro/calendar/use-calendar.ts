import { useState } from "react";
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from "date-fns";
import { SAMPLE_TODAY, categories } from "./calendar-data";
import { calendarStore } from "./calendar-store";
import type { CalendarEvent, CategoryId } from "./calendar-data";

export type View = "month" | "week" | "day";

/** The calendar's state: which day and view are shown, the events, and which categories are on. */
export function useCalendar() {
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(SAMPLE_TODAY);
  const events = calendarStore.use();
  const setEvents = calendarStore.set;
  const [hidden, setHidden] = useState<CategoryId[]>([]);

  const move = (direction: 1 | -1) =>
    setAnchor((current) => {
      if (view === "month") return direction === 1 ? addMonths(current, 1) : subMonths(current, 1);
      if (view === "week") return direction === 1 ? addWeeks(current, 1) : subWeeks(current, 1);
      return direction === 1 ? addDays(current, 1) : subDays(current, 1);
    });

  const visibleEvents = events.filter((event) => !hidden.includes(event.category));

  const toggleCategory = (id: CategoryId) =>
    setHidden((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const save = (event: CalendarEvent) =>
    setEvents((current) =>
      current.some((item) => item.id === event.id)
        ? current.map((item) => (item.id === event.id ? event : item))
        : [...current, event],
    );

  const remove = (id: string) => setEvents((current) => current.filter((item) => item.id !== id));

  return {
    view,
    setView,
    anchor,
    setAnchor,
    events,
    visibleEvents,
    hidden,
    categories,
    toggleCategory,
    next: () => move(1),
    previous: () => move(-1),
    today: () => setAnchor(new Date()),
    save,
    remove,
  };
}

export type CalendarState = ReturnType<typeof useCalendar>;
