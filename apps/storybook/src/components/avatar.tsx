import { Children } from "react";
import type { ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "grid size-full place-items-center bg-secondary text-xs text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Overlapping avatars. Shows the first `max`, then a "+n" avatar for the rest.
 * Give the children a size (for example className="size-9"); the ring is added here.
 */
export function AvatarGroup({
  max = 4,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { max?: number }) {
  const items = Children.toArray(children);
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;

  return (
    <div className={cn("flex -space-x-2 *:ring-2 *:ring-background", className)} {...props}>
      {shown}
      {rest > 0 && (
        <Avatar>
          <AvatarFallback className="bg-muted text-muted-foreground">+{rest}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
