import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const alertVariants = cva(
  "relative grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-0.5 rounded-lg border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground [&>svg]:text-muted-foreground",
        info: "border-info/30 bg-info/10 text-card-foreground [&>svg]:text-info",
        success: "border-success/30 bg-success/10 text-card-foreground [&>svg]:text-success",
        warning: "border-warning/40 bg-warning/10 text-card-foreground [&>svg]:text-warning",
        destructive:
          "border-destructive/40 bg-destructive/10 text-card-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/** Put an icon as the first child; the title and description fill the second column. */
export function Alert({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("col-start-2", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("col-start-2 text-muted-foreground", className)} {...props} />;
}
