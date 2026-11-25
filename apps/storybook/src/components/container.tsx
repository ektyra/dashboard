import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    size: {
      /** 44rem: reading width. */
      narrow: "max-w-176",
      /** 72rem: the default page width. */
      default: "max-w-6xl",
      /** No limit. */
      fluid: "max-w-none",
    },
  },
  defaultVariants: { size: "default" },
});

type ContainerProps = ComponentProps<"div"> & VariantProps<typeof containerVariants>;

/** Centers content and limits its width. */
export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
