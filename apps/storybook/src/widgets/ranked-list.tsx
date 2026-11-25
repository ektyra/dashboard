import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type RankedItem = { label: string; value: number; display?: string; icon?: ReactNode };

/** A short list ranked by a number, each row with a bar sized against the largest. */
export function RankedList({
  items,
  className,
}: Readonly<{ items: RankedItem[]; className?: string }>) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <ol className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item.label} className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              {item.icon}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 text-muted-foreground tabular-nums">
              {item.display ?? item.value.toLocaleString("en")}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
