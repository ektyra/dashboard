import { useState } from "react";

const KEY = "ektyra-recent-emoji";
const MAX = 16;

function read(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string").slice(0, MAX)
      : [];
  } catch {
    return [];
  }
}

/** The emoji you picked lately, newest first, remembered in this browser. */
export function useRecentEmoji() {
  // Read on first use in the browser; the picker only mounts when opened, so the server never needs it.
  const [recent, setRecent] = useState<string[]>(read);
  const add = (emoji: string) => {
    const next = [emoji, ...recent.filter((item) => item !== emoji)].slice(0, MAX);
    setRecent(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage can be blocked; the list then lasts until the picker closes.
    }
  };
  return { recent, add };
}
