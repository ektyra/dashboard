import { useState } from "react";
import { Forward } from "lucide-react";
import { Button } from "../../components/button";
import { Checkbox } from "../../components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { Label } from "../../components/label";
import { contacts } from "./chat-data";
import type { Message } from "./chat-data";
import { ContactAvatar } from "./contact-avatar";

type ForwardDialogProps = Readonly<{
  message: Message | undefined;
  /** The person this message is in a chat with; they are not offered again. */
  fromContactId: string;
  onClose: () => void;
  onForward: (message: Message, toIds: string[]) => void;
}>;

function ForwardForm({
  message,
  fromContactId,
  onClose,
  onForward,
}: Readonly<Omit<ForwardDialogProps, "message"> & { message: Message }>) {
  const [chosen, setChosen] = useState<string[]>([]);
  const options = contacts.filter((contact) => contact.id !== fromContactId);
  const toggle = (id: string) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <div className="grid gap-4">
      <p className="line-clamp-3 rounded-lg border-l-2 border-primary bg-muted/50 px-3 py-2 text-sm [overflow-wrap:anywhere]">
        {message.text}
      </p>
      <ul className="grid gap-1" aria-label="Send to">
        {options.map((contact) => (
          <li key={contact.id}>
            <Label
              htmlFor={`fwd-${contact.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted"
            >
              <Checkbox
                id={`fwd-${contact.id}`}
                checked={chosen.includes(contact.id)}
                onCheckedChange={() => toggle(contact.id)}
              />
              <ContactAvatar contact={contact} className="size-8" />
              <span className="grid">
                <span>{contact.name}</span>
                <span className="text-xs text-muted-foreground">{contact.role}</span>
              </span>
            </Label>
          </li>
        ))}
      </ul>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={chosen.length === 0}
          onClick={() => {
            onForward(message, chosen);
            onClose();
          }}
        >
          <Forward aria-hidden="true" />
          Forward{chosen.length > 1 ? ` to ${chosen.length} people` : ""}
        </Button>
      </DialogFooter>
    </div>
  );
}

/** Choose who gets a copy of a message. */
export function ForwardDialog({ message, fromContactId, onClose, onForward }: ForwardDialogProps) {
  return (
    <Dialog open={Boolean(message)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[min(28rem,calc(100vw-2rem))] grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
          <DialogDescription>
            Pick one or more people. They get the text, marked as forwarded.
          </DialogDescription>
        </DialogHeader>
        {message && (
          <ForwardForm
            key={message.id}
            message={message}
            fromContactId={fromContactId}
            onClose={onClose}
            onForward={onForward}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
