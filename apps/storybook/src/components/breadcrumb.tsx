import type { ComponentProps } from "react";
import { ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "../lib/cn";

export function Breadcrumb(props: ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

/** Use `asChild` to wrap a router Link. */
export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp className={cn("transition-colors hover:text-foreground", className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return <span aria-current="page" className={cn("text-foreground", className)} {...props} />;
}

export function BreadcrumbSeparator({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      <ChevronRight />
    </li>
  );
}
