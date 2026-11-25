import type { ComponentProps } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/** One thumb for a single value, two for a range: pass `value` or `defaultValue` as `[n]` or `[a, b]`. */
export function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = (value ?? defaultValue ?? [min]).length;
  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      min={min}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full bg-primary/15 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
        <SliderPrimitive.Range className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={thumbs === 2 ? (index === 0 ? "Minimum" : "Maximum") : undefined}
          className="block size-4 cursor-grab rounded-full border-2 border-primary bg-background shadow-sm outline-none transition-[box-shadow,transform] hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/30 active:cursor-grabbing"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
