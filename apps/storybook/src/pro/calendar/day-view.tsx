import type { CalendarEvent } from "./calendar-data";
import { TimeGrid } from "./time-grid";

type Props = Readonly<{
  anchor: Date;
  events: CalendarEvent[];
  today: Date | undefined;
  onOpenEvent: (event: CalendarEvent) => void;
  onCreate: (day: Date, minutes: number) => void;
}>;

export function DayView({ anchor, ...rest }: Props) {
  return <TimeGrid days={[anchor]} {...rest} />;
}
