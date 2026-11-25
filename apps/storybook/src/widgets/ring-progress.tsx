import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type RingProgressProps = Readonly<{
  /** 0 to 100. */
  value: number;
  /** Diameter in pixels. */
  size?: number;
  strokeWidth?: number;
  /** Text in the middle. */
  children?: ReactNode;
  label: string;
  className?: string;
}>;

/** A circle that fills to a percentage, in the brand color. Drawn in SVG, no library. */
export function RingProgress({
  value,
  size = 132,
  strokeWidth = 12,
  children,
  label,
  className,
}: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
