import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import type { badgeVariants } from "../../components/badge";
import { cn } from "../../lib/cn";
import { memberById } from "./kanban-data";
import type { Label, Priority } from "./kanban-data";

type Variant = NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];

const labelVariant: Record<Label, Variant> = {
  Design: "info",
  Content: "secondary",
  Bug: "destructive",
  Development: "outline",
};

const priorityVariant: Record<Priority, Variant> = {
  High: "destructive",
  Medium: "warning",
  Low: "secondary",
};

export const LabelBadge = ({ label }: Readonly<{ label: Label }>) => (
  <Badge variant={labelVariant[label]}>{label}</Badge>
);

export const PriorityBadge = ({ priority }: Readonly<{ priority: Priority }>) => (
  <Badge variant={priorityVariant[priority]}>{priority}</Badge>
);

/** A due date, in red when it has passed (and the card is not finished). */
export function DueDate({
  due,
  today,
  done,
}: Readonly<{ due: string; today: string | undefined; done: boolean }>) {
  const overdue = !done && today !== undefined && due < today;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        overdue ? "text-destructive-text" : "text-muted-foreground",
      )}
    >
      <CalendarDays className="size-3.5" aria-hidden="true" />
      {format(parseISO(due), "MMM d")}
      {overdue && <span className="sr-only"> (overdue)</span>}
    </span>
  );
}

export function Assignee({ id }: Readonly<{ id: string | undefined }>) {
  const member = memberById(id);
  if (!member) return null;
  return (
    <Avatar className="size-6" title={member.name}>
      <AvatarFallback className="text-[0.6rem]">{member.initials}</AvatarFallback>
    </Avatar>
  );
}
