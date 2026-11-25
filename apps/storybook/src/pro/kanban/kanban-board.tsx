import { useId, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Board } from "./use-board";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import type { Card } from "./kanban-data";
import { noFilters } from "./kanban-toolbar";
import type { Filters } from "./kanban-toolbar";
import { useToday } from "./use-today";

type KanbanBoardProps = Readonly<{
  board: Board;
  filters: Filters;
  onOpen: (id: string) => void;
}>;

const matches = (card: Card, filters: Filters) =>
  (filters.search === "" ||
    `${card.title} ${card.description}`
      .toLowerCase()
      .includes(filters.search.trim().toLowerCase())) &&
  (filters.assignee === "all" || card.assigneeId === filters.assignee) &&
  (filters.label === "all" || card.label === filters.label);

/** The columns, and the drag and drop between them. */
export function KanbanBoard({ board, filters, onOpen }: KanbanBoardProps) {
  const { cards, columns, setColumns, addCard } = board;
  const dndId = useId();
  const today = useToday();
  const [activeId, setActiveId] = useState<string>();
  const filtering = JSON.stringify(filters) !== JSON.stringify(noFilters);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** The column that holds a card, or the column itself when the id is a column's. */
  const columnOf = (id: string) =>
    columns.find((column) => column.id === id) ??
    columns.find((column) => column.cardIds.includes(id));

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  // While dragging over another column, move the card there so the list makes room for it.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = columnOf(String(active.id));
    const to = columnOf(String(over.id));
    if (!from || !to || from.id === to.id) return;

    setColumns((current) => {
      const target = current.find((column) => column.id === to.id);
      if (!target) return current;
      const overIndex = target.cardIds.indexOf(String(over.id));
      const translated = active.rect.current.translated;
      const below =
        overIndex >= 0 && translated
          ? translated.top > over.rect.top + over.rect.height / 2
          : false;
      const index = overIndex >= 0 ? overIndex + (below ? 1 : 0) : target.cardIds.length;
      return current.map((column) => {
        if (column.id === from.id)
          return { ...column, cardIds: column.cardIds.filter((id) => id !== active.id) };
        if (column.id === to.id) {
          const next = column.cardIds.slice();
          next.splice(index, 0, String(active.id));
          return { ...column, cardIds: next };
        }
        return column;
      });
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(undefined);
    if (!over || active.id === over.id) return;
    const column = columnOf(String(active.id));
    if (!column || column.id !== columnOf(String(over.id))?.id) return;
    const from = column.cardIds.indexOf(String(active.id));
    const to = column.cardIds.indexOf(String(over.id));
    if (to < 0) return;
    setColumns((current) =>
      current.map((item) =>
        item.id === column.id ? { ...item, cardIds: arrayMove(item.cardIds, from, to) } : item,
      ),
    );
  };

  const activeCard = activeId ? cards[activeId] : undefined;

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(undefined)}
    >
      {/* The board scrolls sideways on its own, so the page itself never does. */}
      <div className="-mx-1 flex items-start gap-4 overflow-x-auto px-1 pb-4">
        {columns.map((column) => {
          const visible = column.cardIds
            .map((id) => cards[id])
            .filter((card): card is Card => Boolean(card) && matches(card, filters));
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={visible}
              total={column.cardIds.length}
              today={today}
              done={column.id === "done"}
              dragDisabled={filtering}
              onOpen={onOpen}
              onAdd={(title) => addCard(column.id, title)}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeCard && (
          <KanbanCard
            card={activeCard}
            today={today}
            done={columnOf(activeCard.id)?.id === "done"}
            lifted
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
