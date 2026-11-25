import { useEffect, useState } from "react";

/**
 * Today's date as `YYYY-MM-DD`, known only in the browser. The server cannot know
 * the visitor's day, so this is `undefined` on the first render; anything that
 * depends on it (like "overdue") appears a moment later and never mismatches.
 */
export function useToday() {
  const [today, setToday] = useState<string>();
  useEffect(() => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    setToday(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  }, []);
  return today;
}
