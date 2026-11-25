import { ArrowLeft, Ellipsis, MailMinus, Phone, Trash2, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { IconButton } from "../../components/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import { notify } from "../../toast";
import type { Contact } from "./chat-data";
import { ContactAvatar } from "./contact-avatar";
import { ContactCard } from "./contact-card";

type ChatHeaderProps = Readonly<{
  contact: Contact;
  typing: boolean;
  onBack: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
}>;

/**
 * Who you are talking to. Clicking the name or avatar shows their details. On small
 * screens there is a back button to the list.
 */
export function ChatHeader({ contact, typing, onBack, onMarkUnread, onDelete }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-2 border-b border-border px-4 py-3">
      <IconButton label="Back to conversations" className="md:hidden" onClick={onBack}>
        <ArrowLeft aria-hidden="true" />
      </IconButton>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Show details for ${contact.name}`}
            className="-m-1 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg p-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ContactAvatar contact={contact} />
            <span className="min-w-0">
              <span className="block truncate text-sm">{contact.name}</span>
              <span className="block truncate text-xs text-muted-foreground" aria-live="polite">
                {typing ? "typing…" : `${contact.online ? "Online" : "Offline"} · ${contact.role}`}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <ContactCard contact={contact} />
        </PopoverContent>
      </Popover>
      <IconButton label="Voice call" onClick={() => notify.info("Calls are not part of this demo")}>
        <Phone aria-hidden="true" />
      </IconButton>
      <IconButton label="Video call" onClick={() => notify.info("Calls are not part of this demo")}>
        <Video aria-hidden="true" />
      </IconButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton label="Chat options">
            <Ellipsis aria-hidden="true" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onMarkUnread}>
            <MailMinus aria-hidden="true" />
            Mark as unread
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive [&_svg]:text-destructive"
            onSelect={onDelete}
          >
            <Trash2 aria-hidden="true" />
            Delete chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
