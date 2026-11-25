import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

export function Timeline({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("flex flex-col", className)} {...props} />;
}

type TimelineItemProps = Readonly<{
  title: string;
  /** When it happened, as text ("2 hours ago") or a date. */
  time?: string;
  icon?: ReactNode;
  children?: ReactNode;
  /** The last item has no line below it. */
  last?: boolean;
}>;

export function TimelineItem({ title, time, icon, children, last }: TimelineItemProps) {
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <span aria-hidden="true" className="absolute top-8 bottom-0 left-4 w-px bg-border" />
      )}
      <span className="relative grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0 pt-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          {title}
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
        </p>
        {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
      </div>
    </li>
  );
}
