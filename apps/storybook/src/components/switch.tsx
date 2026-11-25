import type { ComponentProps } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const trackVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: { size: { sm: "h-4 w-7", md: "h-5 w-9", lg: "h-6 w-11" } },
    defaultVariants: { size: "md" },
  },
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-sm transition-transform data-[state=unchecked]:translate-x-0.5",
  {
    variants: {
      size: {
        sm: "size-3 data-[state=checked]:translate-x-3.5",
        md: "size-4 data-[state=checked]:translate-x-[1.1rem]",
        lg: "size-5 data-[state=checked]:translate-x-[1.35rem]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export function Switch({
  className,
  size,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof trackVariants>) {
  return (
    <SwitchPrimitive.Root className={cn(trackVariants({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
    </SwitchPrimitive.Root>
  );
}
