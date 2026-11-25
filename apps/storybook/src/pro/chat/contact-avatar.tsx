import { Avatar, AvatarFallback } from "../../components/avatar";
import { cn } from "../../lib/cn";
import type { Contact } from "./chat-data";

/** A person's avatar, with a small green dot when they are online. */
export function ContactAvatar({
  contact,
  className,
}: Readonly<{ contact: Contact; className?: string }>) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar className={cn("size-10", className)}>
        <AvatarFallback className="text-xs">{contact.initials}</AvatarFallback>
      </Avatar>
      {contact.online && (
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-success">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  );
}
