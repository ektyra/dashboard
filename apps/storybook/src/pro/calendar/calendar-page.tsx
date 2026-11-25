import { useState } from "react";
import { setHours, setMinutes } from "date-fns";
import { PageHeader } from "../../shell/page-header";
import { notify } from "../../toast";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarToolbar } from "./calendar-toolbar";
import { DayView } from "./day-view";
import { EventDialog, newEventAt } from "./event-dialog";
import type { EventDraft } from "./event-dialog";
import { MonthView } from "./month-view";
import { useCalendar } from "./use-calendar";
import { useNow } from "./use-now";
import { WeekView } from "./week-view";

export function CalendarPage() {
  const calendar = useCalendar();
  const now = useNow();
  const [draft, setDraft] = useState<EventDraft>();
  const { view, anchor, visibleEvents } = calendar;

  const startOfDayAt = (day: Date, minutes: number) =>
    setMinutes(setHours(day, Math.floor(minutes / 60)), minutes % 60);

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Plan meetings, content and launches. Click a day or a time slot to add an event. Sample events."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <CalendarSidebar
          anchor={anchor}
          onSelectDay={calendar.setAnchor}
          hidden={calendar.hidden}
          onToggle={calendar.toggleCategory}
          events={calendar.events}
        />
        <div className="min-w-0">
          <CalendarToolbar
            view={view}
            anchor={anchor}
            onViewChange={calendar.setView}
            onPrevious={calendar.previous}
            onNext={calendar.next}
            onToday={calendar.today}
            onNew={() => setDraft(newEventAt(startOfDayAt(now ?? anchor, 9 * 60)))}
          />
          {view === "month" && (
            <MonthView
              anchor={anchor}
              events={visibleEvents}
              today={now}
              onOpenEvent={(event) => setDraft({ event, isNew: false })}
              onCreate={(day) => setDraft(newEventAt(startOfDayAt(day, 9 * 60)))}
              onOpenDay={(day) => {
                calendar.setAnchor(day);
                calendar.setView("day");
              }}
            />
          )}
          {view === "week" && (
            <WeekView
              anchor={anchor}
              events={visibleEvents}
              today={now}
              onOpenEvent={(event) => setDraft({ event, isNew: false })}
              onCreate={(day, minutes) => setDraft(newEventAt(startOfDayAt(day, minutes)))}
            />
          )}
          {view === "day" && (
            <DayView
              anchor={anchor}
              events={visibleEvents}
              today={now}
              onOpenEvent={(event) => setDraft({ event, isNew: false })}
              onCreate={(day, minutes) => setDraft(newEventAt(startOfDayAt(day, minutes)))}
            />
          )}
        </div>
      </div>
      <EventDialog
        draft={draft}
        onClose={() => setDraft(undefined)}
        onSave={(event) => {
          calendar.save(event);
          notify.success(draft?.isNew ? "Event added" : "Event saved", {
            description: event.title,
          });
        }}
        onDelete={(id) => {
          calendar.remove(id);
          notify.info("Event deleted");
        }}
      />
    </>
  );
}
