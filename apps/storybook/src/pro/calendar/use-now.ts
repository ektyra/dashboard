import { useEffect, useState } from "react";

/**
 * The current time, known only in the browser (so `undefined` on the server and
 * the first render, which keeps both sides the same). Updates every minute.
 */
export function useNow() {
  const [now, setNow] = useState<Date>();
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
