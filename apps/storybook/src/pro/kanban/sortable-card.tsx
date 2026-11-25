import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "./kanban-card";
import type { Card } from "./kanban-data";

type SortableCardProps = Readonly<{
  card: Card;
  today: string | undefined;
  done: boolean;
  disabled: boolean;
  onOpen: () => void;
}>;

/** A card that can be dragged: it moves out of the way while another is dragged over it. */
export function SortableCard({ card, today, done, disabled, onOpen }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      // The original stays as a faint placeholder while the copy follows the pointer.
      className={isDragging ? "opacity-40" : undefined}
    >
      <KanbanCard
        card={card}
        today={today}
        done={done}
        onOpen={onOpen}
        handle={
          disabled ? { disabled: true } : { ref: setActivatorNodeRef, ...attributes, ...listeners }
        }
      />
    </li>
  );
}
