import type { ComponentProps } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  loading = false,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** Shows a spinner instead of the arrow, for a value or options that are still loading. */
  loading?: boolean;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 data-placeholder:text-muted-foreground [&>span]:flex [&>span]:min-w-0 [&>span]:items-center [&>span]:gap-2 [&>span]:overflow-hidden [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        {loading ? (
          <Spinner className="text-muted-foreground" aria-label="Loading" />
        ) : (
          <ChevronDown className="text-muted-foreground" aria-hidden="true" />
        )}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        className={cn(
          "animate-tooltip-in relative z-50 max-h-72 min-w-32 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg motion-reduce:animate-none",
          position === "popper" && "w-(--radix-select-trigger-width)",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 grid place-items-center">
        <Check className="size-4 text-primary!" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
}

/**
 * A line inside the list that is not an option: "Loading regions…" with a
 * spinner, or a message with a retry button. Put it in SelectContent in place of
 * the items while they load.
 */
export function SelectStatus({
  loading = false,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { loading?: boolean }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {loading && <Spinner aria-hidden="true" />}
      {children}
    </div>
  );
}
