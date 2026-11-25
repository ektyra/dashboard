import type { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const Tabs = TabsPrimitive.Root;

/** `pill` is a segmented control; `line` is plain text with an underline. */
export function TabsList({
  className,
  variant = "pill",
  ...props
}: ComponentProps<typeof TabsPrimitive.List> & { variant?: "pill" | "line" }) {
  return (
    <TabsPrimitive.List
      data-variant={variant}
      className={cn(
        "inline-flex items-center text-muted-foreground",
        variant === "pill" ? "gap-1 rounded-lg bg-muted p-1" : "gap-4 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground [&_svg]:size-4",
        // pill
        "in-data-[variant=pill]:rounded-md in-data-[variant=pill]:px-3 in-data-[variant=pill]:py-1.5 in-data-[variant=pill]:data-[state=active]:bg-background in-data-[variant=pill]:data-[state=active]:text-foreground in-data-[variant=pill]:data-[state=active]:shadow-sm",
        // line
        "in-data-[variant=line]:-mb-px in-data-[variant=line]:border-b-2 in-data-[variant=line]:border-transparent in-data-[variant=line]:pb-2.5 in-data-[variant=line]:data-[state=active]:border-primary in-data-[variant=line]:data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  );
}
