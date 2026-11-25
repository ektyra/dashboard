import { addCardToColumn, boardStore } from "./board-store";
import type { Card, Column } from "./kanban-data";

/** The board's state and the changes you can make to it. The state lives in `board-store`. */
export function useBoard() {
  const { cards, columns } = boardStore.use();

  const setColumns = (update: Column[] | ((current: Column[]) => Column[])) =>
    boardStore.set((state) => ({
      ...state,
      columns: typeof update === "function" ? update(state.columns) : update,
    }));

  const addCard = (columnId: string, title: string) => {
    const id = `c${Date.now()}`;
    addCardToColumn(columnId, { id, title, description: "", label: "Content", priority: "Medium" });
    return id;
  };

  const updateCard = (card: Card) =>
    boardStore.set((state) => ({ ...state, cards: { ...state.cards, [card.id]: card } }));

  const deleteCard = (id: string) =>
    boardStore.set((state) => {
      const { [id]: _removed, ...rest } = state.cards;
      return {
        cards: rest,
        columns: state.columns.map((column) => ({
          ...column,
          cardIds: column.cardIds.filter((item) => item !== id),
        })),
      };
    });

  return { cards, columns, setColumns, addCard, updateCard, deleteCard };
}

export type Board = ReturnType<typeof useBoard>;
