import { useSyncExternalStore } from "react";

/**
 * A tiny shared store: one value that many components can read and change, kept
 * in memory. It lets the navbar bell and the sidebar know about unread chats and
 * emails that live in other pages. Reading it with `use` is safe on the server,
 * which always sees the starting value.
 */
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    get: () => state,
    set: (update: T | ((current: T) => T)) => {
      state = typeof update === "function" ? (update as (current: T) => T)(state) : update;
      for (const listener of listeners) listener();
    },
    /** Read the value (or a part of it) in a component; it re-renders when the value changes. */
    use: <S = T>(select: (value: T) => S = (value) => value as unknown as S): S =>
      // eslint-disable-next-line react-hooks/rules-of-hooks -- called from components only
      useSyncExternalStore(
        subscribe,
        () => select(state),
        () => select(initial),
      ),
  };
}
