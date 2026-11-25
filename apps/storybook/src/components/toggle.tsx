import type { ComponentProps } from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:size-4",
  {
    variants: {
      variant: { default: "bg-transparent", outline: "border border-input bg-transparent" },
      size: { sm: "h-8 px-2.5", md: "h-9 px-3", lg: "h-10 px-4" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** A single button that stays pressed or not. */
export function Toggle({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root className={cn(toggleVariants({ variant, size }), className)} {...props} />
  );
}
