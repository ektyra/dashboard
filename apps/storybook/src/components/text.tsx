import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const textVariants = cva("", {
  variants: {
    variant: {
      /** Normal paragraph text. */
      body: "text-base leading-7 text-foreground",
      /** Intro paragraph under a page title. */
      lead: "text-lg leading-8 text-muted-foreground",
      /** Smaller supporting text. */
      small: "text-sm leading-6 text-foreground",
      /** Quiet text for hints and descriptions. */
      muted: "text-sm leading-6 text-muted-foreground",
    },
  },
  defaultVariants: { variant: "body" },
});

type TextProps = ComponentProps<"p"> & VariantProps<typeof textVariants>;

export function Text({ variant, className, ...props }: TextProps) {
  return <p className={cn(textVariants({ variant }), className)} {...props} />;
}
