import type { ButtonHTMLAttributes, Ref } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../../lib/cn";
import { Assignee, DueDate, LabelBadge, PriorityBadge } from "./card-meta";
import type { Card } from "./kanban-data";

type KanbanCardProps = Readonly<{
  card: Card;
  today: string | undefined;
  done: boolean;
  /** The drag handle's props (from dnd-kit). Without them the card has no handle. */
  handle?: ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };
  onOpen?: () => void;
  /** Dragging, or the copy that follows the pointer. */
  lifted?: boolean;
}>;

/** What a card looks like. The same markup is used in the column and in the drag preview. */
export function KanbanCard({ card, today, done, handle, onOpen, lifted }: KanbanCardProps) {
  return (
    <div
      className={cn(
        "group flex gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs transition-shadow hover:shadow-sm",
        lifted && "shadow-lg ring-2 ring-primary/40",
      )}
    >
      <button
        type="button"
        aria-label={`Drag ${card.title}`}
        className="-ml-1 grid size-6 shrink-0 cursor-grab touch-none place-items-center rounded text-muted-foreground opacity-60 outline-none hover:bg-muted hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing group-hover:opacity-100"
        {...handle}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <div className="grid min-w-0 flex-1 gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="cursor-pointer rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="line-clamp-2">{card.title}</span>
        </button>
        <div className="flex flex-wrap items-center gap-1.5">
          <LabelBadge label={card.label} />
          {card.priority === "High" && <PriorityBadge priority={card.priority} />}
        </div>
        <div className="flex items-center justify-between gap-2">
          {card.due ? <DueDate due={card.due} today={today} done={done} /> : <span />}
          <Assignee id={card.assigneeId} />
        </div>
      </div>
    </div>
  );
}
