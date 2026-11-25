import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import type { Message } from "./chat-data";
import { EmojiPicker } from "./emoji-picker";

/** The full emoji picker, for reactions that are not in the quick row. */
export function ReactionPickerDialog({
  message,
  onClose,
  onPick,
}: Readonly<{
  message: Message | undefined;
  onClose: () => void;
  onPick: (message: Message, emoji: string) => void;
}>) {
  return (
    <Dialog open={Boolean(message)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-fit max-w-[calc(100vw-2rem)] grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>React with an emoji</DialogTitle>
          <DialogDescription>Choose one to add it under the message.</DialogDescription>
        </DialogHeader>
        <EmojiPicker
          onPick={(emoji) => {
            if (message) onPick(message, emoji);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
