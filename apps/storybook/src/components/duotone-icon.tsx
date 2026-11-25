import type { LucideIcon } from "lucide-react";

export type DuotoneTone = "primary" | "success" | "warning" | "info" | "destructive" | "mixed";

// The stroke color for each tone. "mixed" keeps the stroke neutral and lets the brand color fill.
const stroke: Record<DuotoneTone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  destructive: "var(--destructive)",
  mixed: "var(--foreground)",
};

const fillColor: Record<DuotoneTone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  destructive: "var(--destructive)",
  mixed: "var(--primary)",
};

type DuotoneIconProps = Readonly<{
  icon: LucideIcon;
  tone?: DuotoneTone;
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

/**
 * A two-tone icon: the outline in one color and a soft tint of the same hue
 * inside it. Works best with icons made of closed shapes (heart, folder, bell).
 * Icons that are mostly open lines (arrows, check marks) get little or no fill.
 */
export function DuotoneIcon({
  icon: Icon,
  tone = "primary",
  size = 24,
  strokeWidth = 1.75,
  className,
}: DuotoneIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={className}
      style={{
        stroke: stroke[tone],
        fill: `color-mix(in oklab, ${fillColor[tone]} ${tone === "mixed" ? 35 : 22}%, transparent)`,
      }}
    />
  );
}
