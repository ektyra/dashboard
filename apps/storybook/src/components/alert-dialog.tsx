import type { ComponentProps } from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px] data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:animate-none" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl outline-none data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap justify-end gap-2", className)} {...props} />;
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title className={cn("text-lg tracking-tight", className)} {...props} />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** The confirming button. Use `variant="destructive"` for something that deletes. */
export function AlertDialogAction({
  className,
  variant,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: Parameters<typeof buttonVariants>[0] extends infer P
    ? P extends { variant?: infer V }
      ? V
      : never
    : never;
}) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}
