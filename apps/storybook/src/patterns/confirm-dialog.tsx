import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/alert-dialog";
import { buttonVariants } from "../components/button";
import { cn } from "../lib/cn";

type ConfirmDialogProps = Readonly<{
  /** The button or link that opens the dialog. */
  trigger: ReactNode;
  /** A question that names the thing: "Delete invoice INV-004?" */
  title: string;
  /** What will happen, and whether it can be undone. */
  description: ReactNode;
  /** The verb on the confirm button, matching the title: "Delete invoice". */
  confirmLabel: string;
  cancelLabel?: string;
  /** Red confirm button, for deleting or other hard-to-undo actions. */
  destructive?: boolean;
  onConfirm: () => void;
}>;

/**
 * Asks before something that is hard to undo. Name what will be affected, and
 * label the button with the action (not "OK"). Cancel is the default focus.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(destructive && buttonVariants({ variant: "destructive" }))}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
