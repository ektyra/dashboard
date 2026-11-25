import { format } from "date-fns";
import { Forward } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Message } from "./chat-data";
import { me } from "./chat-data";
import { MessageContextMenu } from "./message-context-menu";
import type { MessageActions } from "./message-context-menu";
import { ReactionBar } from "./reaction-bar";
import { QuoteInBubble } from "./reply-quote";

type MessageBubbleProps = Readonly<{
  message: Message;
  /** The message this one answers, if it still exists. */
  quoted: Message | undefined;
  /** The last message of a run from the same sender shows the time. */
  showTime: boolean;
  actions: MessageActions;
}>;

export function MessageBubble({ message, quoted, showTime, actions }: MessageBubbleProps) {
  const mine = message.from === me;
  return (
    <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <MessageContextMenu message={message} actions={actions}>
        {/* Focusable so the keyboard can open the menu (Menu key or Shift+F10). */}
        <div
          tabIndex={0}
          className={cn(
            "max-w-[min(32rem,85%)] rounded-2xl px-3.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:ring-2 data-[state=open]:ring-primary/40",
            mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted",
          )}
        >
          {message.forwarded && (
            <span className="mb-1 flex items-center gap-1 text-xs italic opacity-80">
              <Forward className="size-3" aria-hidden="true" />
              Forwarded
            </span>
          )}
          {message.replyTo && <QuoteInBubble message={quoted} mine={mine} />}
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{message.text}</p>
        </div>
      </MessageContextMenu>
      <ReactionBar message={message} onToggle={(emoji) => actions.onReact(message, emoji)} />
      {showTime && (
        <span className="px-1 text-[0.65rem] text-muted-foreground tabular-nums">
          {format(message.sentAt, "HH:mm")}
        </span>
      )}
    </div>
  );
}
