import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/**
 * An input with things attached: text, icons, buttons. The group draws the
 * border and the focus ring; put an `InputGroupInput` inside it.
 */
export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      className={cn(
        "flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-[3px] has-[[aria-invalid=true]]:ring-destructive/15 has-[:disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupInput({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

/** A fixed piece of text or an icon at the start or end. */
export function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex h-full shrink-0 items-center gap-2 bg-muted px-3 text-sm text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** An icon inside the field, with no background. */
export function InputGroupIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center pl-3 text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** A button inside the group. Keeps the group's height and has no border of its own. */
export function InputGroupButton({
  className,
  type = "button",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "flex h-full shrink-0 cursor-pointer items-center gap-2 px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}
