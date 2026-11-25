import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { contacts } from "./chat-data";
import { ContactAvatar } from "./contact-avatar";

type NewChatDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** People who already have a chat are not listed. */
  haveChat: string[];
  onStart: (contactId: string) => void;
}>;

/** Start a conversation with someone you have not written to yet. */
export function NewChatDialog({ open, onOpenChange, haveChat, onStart }: NewChatDialogProps) {
  const available = contacts.filter((contact) => !haveChat.includes(contact.id));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(26rem,calc(100vw-2rem))] grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
          <DialogDescription>Choose who you want to write to.</DialogDescription>
        </DialogHeader>
        {available.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You already have a chat with everyone.
          </p>
        ) : (
          <ul className="grid gap-1" aria-label="People">
            {available.map((contact) => (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => {
                    onStart(contact.id);
                    onOpenChange(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ContactAvatar contact={contact} />
                  <span className="grid">
                    <span className="text-sm">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">{contact.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
