import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/alert-dialog";
import { contactById } from "./chat-data";

type DeleteChatDialogProps = Readonly<{
  /** The contact whose chat would be deleted, or nothing when closed. */
  contactId: string | undefined;
  onClose: () => void;
  onConfirm: (contactId: string) => void;
}>;

/** Asks before deleting a whole conversation, because it cannot be undone. */
export function DeleteChatDialog({ contactId, onClose, onConfirm }: DeleteChatDialogProps) {
  const contact = contactId ? contactById(contactId) : undefined;
  return (
    <AlertDialog open={Boolean(contactId)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the chat with {contact?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            All messages in this conversation are removed from your list and cannot be brought back.{" "}
            {contact?.name} keeps their copy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep chat</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (contactId) onConfirm(contactId);
            }}
          >
            Delete chat
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
