import type { ComponentProps } from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

type ProgressProps = Omit<ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
  /** 0 to 100. Leave it out for an indeterminate bar (progress without a known end). */
  value?: number;
};

export function Progress({ className, value, ...props }: ProgressProps) {
  const indeterminate = value === undefined;
  return (
    <ProgressPrimitive.Root
      value={indeterminate ? null : value}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/15", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full bg-primary transition-[width] duration-300",
          indeterminate && "w-2/5 animate-progress-indeterminate motion-reduce:animate-none",
        )}
        style={indeterminate ? undefined : { width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
