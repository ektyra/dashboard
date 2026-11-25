import type { ComponentProps } from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

export function CollapsibleContent({
  className,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      className={cn(
        "overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
