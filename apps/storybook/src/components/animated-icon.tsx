import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { TargetAndTransition } from "motion/react";

export type IconAnimation =
  | "ring"
  | "beat"
  | "spin"
  | "gear"
  | "nudge"
  | "bounce"
  | "pop"
  | "wiggle"
  | "fly"
  | "drop";

/** What each animation does when it plays. */
const animations: Record<IconAnimation, TargetAndTransition> = {
  ring: { rotate: [0, 14, -12, 9, -6, 3, 0], transition: { duration: 0.8 } },
  beat: { scale: [1, 1.3, 1, 1.2, 1], transition: { duration: 0.7 } },
  spin: { rotate: 360, transition: { duration: 0.7, ease: "easeInOut" } },
  gear: { rotate: 120, transition: { duration: 0.6, ease: "easeInOut" } },
  nudge: { x: [0, 6, 0], transition: { duration: 0.5 } },
  bounce: { y: [0, -7, 0, -3, 0], transition: { duration: 0.6 } },
  pop: { scale: [1, 1.35, 0.95, 1], rotate: [0, 20, 0], transition: { duration: 0.6 } },
  wiggle: { rotate: [0, -12, 12, -8, 8, 0], transition: { duration: 0.6 } },
  fly: { x: [0, 8], y: [0, -8], opacity: [1, 0.2], transition: { duration: 0.45 } },
  drop: { y: [0, 6, 0], transition: { duration: 0.5 } },
};

type AnimatedIconProps = Readonly<{
  icon: LucideIcon;
  animation: IconAnimation;
  size?: number;
  className?: string;
}>;

/**
 * An icon that plays a short animation. It plays when the nearest parent
 * motion element is hovered, focused or pressed (variant "play"); see
 * `AnimatedIconTile`. Under reduced motion it stays still.
 */
export function AnimatedIcon({ icon: Icon, animation, size = 28, className }: AnimatedIconProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      variants={{ rest: {}, play: reduceMotion ? {} : animations[animation] }}
      className="inline-grid"
    >
      <Icon size={size} aria-hidden="true" className={className} />
    </motion.span>
  );
}

/** A button that plays its icon's animation on hover, focus and click. */
export function AnimatedIconTile({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <motion.button
      type="button"
      initial="rest"
      whileHover="play"
      whileFocus="play"
      whileTap="play"
      className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card text-card-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <span className="text-xs text-muted-foreground">{label}</span>
    </motion.button>
  );
}
