import { X } from "lucide-react";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../lib/cn";
import { contactById, me } from "./chat-data";
import type { Message } from "./chat-data";

const authorOf = (message: Message) =>
  message.from === me ? "You" : (contactById(message.from)?.name ?? "Someone");

/** A small block that quotes the message being answered, inside a bubble. */
export function QuoteInBubble({
  message,
  mine,
}: Readonly<{ message: Message | undefined; mine: boolean }>) {
  return (
    <span
      className={cn(
        "mb-1.5 block rounded-lg border-l-2 px-2.5 py-1.5 text-xs",
        mine
          ? "border-primary-foreground/70 bg-primary-foreground/15"
          : "border-primary bg-background/60",
      )}
    >
      {message ? (
        <>
          <span className="block opacity-80">{authorOf(message)}</span>
          <span className="line-clamp-2 [overflow-wrap:anywhere]">{message.text}</span>
        </>
      ) : (
        <span className="opacity-70">Original message deleted</span>
      )}
    </span>
  );
}

/** The bar above the box while you are answering a message, with a button to cancel. */
export function ReplyBar({
  message,
  onCancel,
}: Readonly<{ message: Message; onCancel: () => void }>) {
  return (
    <div className="flex items-center gap-3 border-t border-border bg-muted/40 px-4 py-2">
      <div className="min-w-0 flex-1 border-l-2 border-primary pl-3 text-xs">
        <p className="text-muted-foreground">Replying to {authorOf(message)}</p>
        <p className="truncate">{message.text}</p>
      </div>
      <IconButton label="Cancel reply" className="size-7" onClick={onCancel}>
        <X aria-hidden="true" />
      </IconButton>
    </div>
  );
}
