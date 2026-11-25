import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DateTimePickerProps = Readonly<{
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}>;

const DEFAULT_TIME = "09:00";

/** Pick a day on the calendar and a time of day, in one popover. */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  className,
}: DateTimePickerProps) {
  const time = value ? format(value, "HH:mm") : DEFAULT_TIME;

  const withTime = (day: Date, timeValue: string) => {
    const [hours, minutes] = timeValue.split(":").map(Number);
    return set(day, { hours: hours ?? 0, minutes: minutes ?? 0, seconds: 0, milliseconds: 0 });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-72 justify-start", className)}>
          <CalendarIcon aria-hidden="true" />
          {value ? format(value, "PPP 'at' HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(day) => onChange(day ? withTime(day, time) : undefined)}
        />
        <div className="flex items-center gap-3 border-t border-border p-3">
          <Label htmlFor="date-time-picker-time">Time</Label>
          <Input
            id="date-time-picker-time"
            type="time"
            value={time}
            onChange={(event) => {
              if (event.target.value) onChange(withTime(value ?? new Date(), event.target.value));
            }}
            className="w-32"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
