import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "../../lib/cn";
import { AddCardForm } from "./add-card-form";
import type { Card, Column } from "./kanban-data";
import { SortableCard } from "./sortable-card";

type KanbanColumnProps = Readonly<{
  column: Column;
  /** The cards of this column that match the filters, in order. */
  cards: Card[];
  total: number;
  today: string | undefined;
  done: boolean;
  dragDisabled: boolean;
  onOpen: (id: string) => void;
  onAdd: (title: string) => void;
}>;

export function KanbanColumn({
  column,
  cards,
  total,
  today,
  done,
  dragDisabled,
  onOpen,
  onAdd,
}: KanbanColumnProps) {
  // The column itself accepts drops, so a card can be dropped on an empty column.
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <section
      aria-labelledby={`${column.id}-title`}
      className="flex min-w-72 flex-1 basis-72 flex-col gap-3 rounded-xl bg-muted/50 p-3"
    >
      <header className="flex items-center justify-between gap-2 px-1">
        <h2 id={`${column.id}-title`} className="text-sm">
          {column.title}
        </h2>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
          {cards.length === total ? total : `${cards.length} of ${total}`}
        </span>
      </header>
      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={cn(
            "flex min-h-16 flex-col gap-2 rounded-lg transition-colors",
            isOver && "bg-primary/5 ring-1 ring-primary/30 ring-inset",
          )}
        >
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              today={today}
              done={done}
              disabled={dragDisabled}
              onOpen={() => onOpen(card.id)}
            />
          ))}
          {cards.length === 0 && (
            <li className="grid h-16 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
              {total === 0 ? "Drop a card here" : "No cards match"}
            </li>
          )}
        </ul>
      </SortableContext>
      <AddCardForm columnTitle={column.title} onAdd={onAdd} />
    </section>
  );
}
