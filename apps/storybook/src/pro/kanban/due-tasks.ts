import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { createStore } from "../../lib/store";
import { boardStore } from "./board-store";
import type { Card } from "./kanban-data";
import { useToday } from "./use-today";

/** A card that needs attention soon: overdue, due today, or due in the next two days. */
export type DueTask = {
  /** Changes when the due date changes, so a moved deadline is news again. */
  id: string;
  card: Card;
  kind: "overdue" | "today" | "soon";
  text: string;
  /** The due date, for sorting and showing a time. */
  at: Date;
};

/** The tasks whose notification the user has already seen or opened. */
export const seenTasks = createStore<string[]>([]);

const SOON_DAYS = 2;

/**
 * Cards from the board that are overdue or due soon, nearest first. Cards in the "Done"
 * column never count. Today's date is only known in the browser, so on the server and the
 * first render this list is empty and fills in a moment later.
 */
export function useDueTasks(): DueTask[] {
  const { cards, columns } = boardStore.use();
  const today = useToday();
  if (!today) return [];

  const doneIds = new Set(columns.find((column) => column.id === "done")?.cardIds ?? []);
  const start = parseISO(today);

  return Object.values(cards)
    .filter((card): card is Card & { due: string } => Boolean(card.due) && !doneIds.has(card.id))
    .flatMap((card): DueTask[] => {
      const at = parseISO(card.due);
      const days = differenceInCalendarDays(at, start);
      if (days > SOON_DAYS) return [];
      const text =
        days < 0
          ? `Overdue since ${format(at, "MMM d")}`
          : days === 0
            ? "Due today"
            : days === 1
              ? "Due tomorrow"
              : `Due in ${days} days`;
      return [
        {
          id: `${card.id}:${card.due}`,
          card,
          kind: days < 0 ? "overdue" : days === 0 ? "today" : "soon",
          text,
          at,
        },
      ];
    })
    .sort((a, b) => a.at.getTime() - b.at.getTime());
}

/** How many due tasks have not been seen yet. */
export function useUnseenDueTaskCount(): number {
  const tasks = useDueTasks();
  const seen = seenTasks.use();
  return tasks.filter((task) => !seen.includes(task.id)).length;
}
