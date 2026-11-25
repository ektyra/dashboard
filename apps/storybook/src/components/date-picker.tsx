import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Preset<T> = { label: string; value: T };

function Presets<T>({
  presets,
  onPick,
}: Readonly<{ presets: Preset<T>[]; onPick: (value: T) => void }>) {
  return (
    <ul className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-border p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0">
      {presets.map((preset) => (
        <li key={preset.label}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => onPick(preset.value)}
          >
            {preset.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}

type DatePickerProps = Readonly<{
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  /** Shortcuts shown next to the calendar, such as "Today". */
  presets?: Preset<Date>[];
  className?: string;
}>;

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  presets,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-64 justify-start", className)}>
          <CalendarIcon aria-hidden="true" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-col p-0 sm:flex-row">
        {presets && (
          <Presets
            presets={presets}
            onPick={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        )}
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange(date);
            if (date) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type DateRangePickerProps = Readonly<{
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  presets?: Preset<DateRange>[];
  className?: string;
}>;

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a range",
  presets,
  className,
}: DateRangePickerProps) {
  const label = value?.from
    ? value.to
      ? `${format(value.from, "LLL d")} – ${format(value.to, "LLL d, y")}`
      : format(value.from, "LLL d, y")
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-72 justify-start", className)}>
          <CalendarIcon aria-hidden="true" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-col p-0 sm:flex-row">
        {presets && <Presets presets={presets} onPick={onChange} />}
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          defaultMonth={value?.from}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
