import { endOfWeek, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { ToggleGroup, ToggleGroupItem } from "../../components/toggle-group";
import type { View } from "./use-calendar";

const views: { value: View; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

/** The heading for what is shown: a month, a week's range, or one day. */
export function viewTitle(view: View, anchor: Date) {
  if (view === "month") return format(anchor, "MMMM yyyy");
  if (view === "day") return format(anchor, "EEEE d MMMM yyyy");
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const end = endOfWeek(anchor, { weekStartsOn: 1 });
  return start.getMonth() === end.getMonth()
    ? `${format(start, "d")} – ${format(end, "d MMMM yyyy")}`
    : `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
}

type CalendarToolbarProps = Readonly<{
  view: View;
  anchor: Date;
  onViewChange: (view: View) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onNew: () => void;
}>;

export function CalendarToolbar({
  view,
  anchor,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onNew,
}: CalendarToolbarProps) {
  const unit = view === "month" ? "month" : view === "week" ? "week" : "day";
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label={`Previous ${unit}`}
          onClick={onPrevious}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label={`Next ${unit}`}
          onClick={onNext}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
      </div>
      <h2 className="text-lg tracking-tight" aria-live="polite">
        {viewTitle(view, anchor)}
      </h2>
      <div className="ml-auto flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(next) => next && onViewChange(next as View)}
          aria-label="Calendar view"
        >
          {views.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button size="sm" onClick={onNew}>
          <Plus aria-hidden="true" />
          New event
        </Button>
      </div>
    </div>
  );
}
