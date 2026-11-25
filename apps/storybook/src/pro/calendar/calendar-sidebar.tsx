import { Calendar } from "../../components/calendar";
import { Card, CardContent } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";
import { categories } from "./calendar-data";
import type { CalendarEvent, CategoryId } from "./calendar-data";

type CalendarSidebarProps = Readonly<{
  anchor: Date;
  onSelectDay: (day: Date) => void;
  hidden: CategoryId[];
  onToggle: (id: CategoryId) => void;
  events: CalendarEvent[];
}>;

/** A small month to jump around, and the categories to show or hide. */
export function CalendarSidebar({
  anchor,
  onSelectDay,
  hidden,
  onToggle,
  events,
}: CalendarSidebarProps) {
  return (
    <aside className="grid content-start gap-4">
      <Card>
        <CardContent className="flex justify-center px-1 py-1">
          <Calendar
            mode="single"
            selected={anchor}
            month={anchor}
            onMonthChange={onSelectDay}
            onSelect={(day) => day && onSelectDay(day)}
            weekStartsOn={1}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-3">
          <h2 className="text-sm">Calendars</h2>
          <ul className="grid gap-2">
            {categories.map((category) => {
              const count = events.filter((event) => event.category === category.id).length;
              return (
                <li key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={!hidden.includes(category.id)}
                    onCheckedChange={() => onToggle(category.id)}
                  />
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${category.dot}`} />
                  <Label htmlFor={`cat-${category.id}`} className="flex-1">
                    {category.label}
                  </Label>
                  <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
