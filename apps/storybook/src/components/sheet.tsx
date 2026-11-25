import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 border-border bg-popover p-6 text-popover-foreground shadow-2xl outline-none motion-reduce:animate-none",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-[min(26rem,100vw)] border-l data-[state=closed]:animate-sheet-right-out data-[state=open]:animate-sheet-right-in",
        left: "inset-y-0 left-0 h-full w-[min(26rem,100vw)] border-r data-[state=closed]:animate-sheet-left-out data-[state=open]:animate-sheet-left-in",
        top: "inset-x-0 top-0 max-h-[80dvh] border-b data-[state=closed]:animate-sheet-top-out data-[state=open]:animate-sheet-top-in",
        bottom:
          "inset-x-0 bottom-0 max-h-[80dvh] border-t data-[state=closed]:animate-sheet-bottom-out data-[state=open]:animate-sheet-bottom-in",
      },
    },
    defaultVariants: { side: "right" },
  },
);

/** A panel that slides in from an edge. Same behavior as a Dialog. */
export function SheetContent({
  className,
  side,
  children,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & VariantProps<typeof sheetVariants>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px] data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:animate-none" />
      <SheetPrimitive.Content className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close
          aria-label="Close"
          className="absolute top-4 right-4 grid size-7 cursor-pointer place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pr-6", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-wrap justify-end gap-2", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("text-lg tracking-tight", className)} {...props} />;
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
