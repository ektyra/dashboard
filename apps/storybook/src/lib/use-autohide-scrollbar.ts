import { useCallback, useRef } from "react";

/**
 * Hides a scrollbar after a short idle time and brings it back when you scroll,
 * move the pointer over the area, or use the keyboard inside it. Pair it with the
 * `scrollbar-autohide` class (styles.css), which fades the thumb while
 * `data-idle="true"` is set. The scrollbar is also shown for the first moments
 * after the page loads, as a hint that the area scrolls.
 *
 * Use the returned function as the element's `ref`.
 */
export function useAutohideScrollbar(delayMs = 1500) {
  const cleanup = useRef<(() => void) | undefined>(undefined);

  return useCallback(
    (element: HTMLElement | null) => {
      cleanup.current?.();
      cleanup.current = undefined;
      if (!element) return;

      let timer: ReturnType<typeof setTimeout> | undefined;
      const show = () => {
        element.dataset.idle = "false";
        clearTimeout(timer);
        timer = setTimeout(() => {
          element.dataset.idle = "true";
        }, delayMs);
      };

      const events = [
        "scroll",
        "pointermove",
        "pointerenter",
        "wheel",
        "keydown",
        "focusin",
      ] as const;
      for (const name of events) element.addEventListener(name, show, { passive: true });
      show();

      cleanup.current = () => {
        clearTimeout(timer);
        for (const name of events) element.removeEventListener(name, show);
      };
    },
    [delayMs],
  );
}
