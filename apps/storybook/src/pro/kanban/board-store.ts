import { createStore } from "../../lib/store";
import { initialCards, initialColumns } from "./kanban-data";
import type { Card, Column } from "./kanban-data";

/** The Kanban board, shared so other pages (like Email) can add a card to it. */
export const boardStore = createStore<{ cards: Record<string, Card>; columns: Column[] }>({
  cards: Object.fromEntries(initialCards.map((card) => [card.id, card])),
  columns: initialColumns,
});

/** Put a finished card at the end of a column, such as "backlog". */
export function addCardToColumn(columnId: string, card: Card) {
  boardStore.set((state) => ({
    cards: { ...state.cards, [card.id]: card },
    columns: state.columns.map((column) =>
      column.id === columnId ? { ...column, cardIds: [...column.cardIds, card.id] } : column,
    ),
  }));
}
