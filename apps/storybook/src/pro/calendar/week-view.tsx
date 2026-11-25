import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import type { CalendarEvent } from "./calendar-data";
import { TimeGrid } from "./time-grid";

type Props = Readonly<{
  anchor: Date;
  events: CalendarEvent[];
  today: Date | undefined;
  onOpenEvent: (event: CalendarEvent) => void;
  onCreate: (day: Date, minutes: number) => void;
}>;

export function WeekView({ anchor, ...rest }: Props) {
  const days = eachDayOfInterval({
    start: startOfWeek(anchor, { weekStartsOn: 1 }),
    end: endOfWeek(anchor, { weekStartsOn: 1 }),
  });
  return <TimeGrid days={days} {...rest} />;
}
