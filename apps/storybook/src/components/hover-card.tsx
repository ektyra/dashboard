import type { ComponentProps } from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "animate-tooltip-in z-50 w-72 origin-(--radix-hover-card-content-transform-origin) rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
