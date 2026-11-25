import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

export type Range = 7 | 30 | 90;

const options: { value: Range; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

/** The "Last 30 days" picker in a dashboard's header. */
export function RangeSelect({
  value,
  onChange,
}: Readonly<{ value: Range; onChange: (value: Range) => void }>) {
  return (
    <Select value={String(value)} onValueChange={(next) => onChange(Number(next) as Range)}>
      <SelectTrigger aria-label="Time range" className="h-9 w-44">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
