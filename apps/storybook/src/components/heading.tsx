import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const headingVariants = cva("font-semibold tracking-tight text-foreground text-balance", {
  variants: {
    size: {
      "4xl": "text-4xl",
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      xl: "text-xl",
      lg: "text-lg",
      base: "text-base",
    },
  },
  defaultVariants: { size: "2xl" },
});

type Level = 1 | 2 | 3 | 4 | 5 | 6;

// Sensible default size for each heading level.
const defaultSize: Record<Level, NonNullable<VariantProps<typeof headingVariants>["size"]>> = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "base",
};

type HeadingProps = Omit<ComponentProps<"h1">, "size"> &
  VariantProps<typeof headingVariants> & {
    /** The semantic level (h1–h6). Pick it for the outline of the page, not for the look. */
    level?: Level;
  };

/** A heading. `level` sets the element, `size` the look; by default size follows level. */
export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(headingVariants({ size: size ?? defaultSize[level] }), className)}
      {...props}
    />
  );
}
