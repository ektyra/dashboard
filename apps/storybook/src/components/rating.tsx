import { useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

type RatingProps = Readonly<{
  /** Current value. With `allowHalf`, 3.5 is a half star. */
  value: number;
  onValueChange?: (value: number) => void;
  max?: number;
  /** Let people pick half stars (the left half of a star). */
  allowHalf?: boolean;
  /** Show the value without letting anyone change it. */
  readOnly?: boolean;
  /** Describes what is rated, for screen readers. */
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}>;

const sizes = { sm: "size-4", md: "size-6", lg: "size-8" } as const;

/** How much of star number `index` (0-based) is filled for a value: 0, 0.5 or 1. */
const fillOf = (index: number, value: number) => Math.min(1, Math.max(0, value - index));

/**
 * A star rating. Hovering previews the rating: stars fill up to the pointer and
 * empty after it. It works as one slider for keyboards and screen readers:
 * arrow keys change the value, Home clears it, End sets the maximum.
 */
export function Rating({
  value,
  onValueChange,
  max = 5,
  allowHalf = false,
  readOnly = false,
  label = "Rating",
  size = "md",
  className,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  const step = allowHalf ? 0.5 : 1;
  const text = `${value} out of ${max}`;

  const valueFromPointer = (event: PointerEvent<HTMLElement>, index: number) => {
    if (!allowHalf) return index + 1;
    const box = event.currentTarget.getBoundingClientRect();
    return index + (event.clientX - box.left < box.width / 2 ? 0.5 : 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: Math.min(max, value + step),
      ArrowUp: Math.min(max, value + step),
      ArrowLeft: Math.max(0, value - step),
      ArrowDown: Math.max(0, value - step),
      Home: 0,
      End: max,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onValueChange?.(next);
  };

  const stars = Array.from({ length: max }, (_, index) => {
    const fill = fillOf(index, shown);
    const previewing = hover !== null;
    return (
      <span
        key={index}
        onPointerMove={readOnly ? undefined : (event) => setHover(valueFromPointer(event, index))}
        onClick={
          readOnly
            ? undefined
            : (event) => {
                const picked = valueFromPointer(
                  event as unknown as PointerEvent<HTMLElement>,
                  index,
                );
                onValueChange?.(picked === value ? 0 : picked);
              }
        }
        className={cn("relative inline-block", sizes[size], !readOnly && "cursor-pointer")}
      >
        {/* The empty star underneath. */}
        <Star
          aria-hidden="true"
          className={cn("absolute inset-0 text-muted-foreground/40", sizes[size])}
        />
        {/* The filled star on top, revealed from the left. Its edge slides, so stars fill and empty smoothly. */}
        <Star
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
          className={cn(
            "absolute inset-0 fill-warning text-warning transition-[clip-path,transform] duration-150 ease-out motion-reduce:transition-none",
            sizes[size],
            previewing && fill > 0 && "scale-110",
          )}
        />
      </span>
    );
  });

  if (readOnly) {
    return (
      <div role="img" aria-label={`${label}: ${text}`} className={cn("flex gap-0.5", className)}>
        {stars}
      </div>
    );
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={text}
      onKeyDown={onKeyDown}
      onPointerLeave={() => setHover(null)}
      className={cn(
        "flex w-fit gap-0.5 rounded-md p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {stars}
    </div>
  );
}
