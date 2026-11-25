import { useEffect, useState } from "react";
import { PageHeader } from "../../shell/page-header";
import { notify } from "../../toast";
import { CardDialog } from "./card-dialog";
import { KanbanBoard } from "./kanban-board";
import { KanbanToolbar, noFilters } from "./kanban-toolbar";
import type { Filters } from "./kanban-toolbar";
import { seenTasks, useDueTasks } from "./due-tasks";
import { useBoard } from "./use-board";

export function KanbanPage() {
  const board = useBoard();

  // Opening the board counts as seeing what is due, so the sidebar badge and the bell go quiet.
  const due = useDueTasks();
  useEffect(() => {
    if (due.length > 0)
      seenTasks.set((current) => [...new Set([...current, ...due.map((task) => task.id)])]);
  }, [due.length]); // eslint-disable-line react-hooks/exhaustive-deps -- only a change in how many are due matters
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [openId, setOpenId] = useState<string>();

  return (
    <>
      <PageHeader
        title="Kanban"
        subtitle="Drag cards between columns, or use the handle with the keyboard: Space to pick up, arrow keys to move, Space to drop. Sample tasks."
      />
      <KanbanToolbar filters={filters} onChange={setFilters} />
      <KanbanBoard board={board} filters={filters} onOpen={setOpenId} />
      <CardDialog
        card={openId ? board.cards[openId] : undefined}
        onClose={() => setOpenId(undefined)}
        onSave={(card) => {
          board.updateCard(card);
          notify.success("Card saved", { description: card.title });
        }}
        onDelete={(id) => {
          board.deleteCard(id);
          notify.info("Card deleted");
        }}
      />
    </>
  );
}
