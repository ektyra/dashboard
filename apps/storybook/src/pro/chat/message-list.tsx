import { useEffect, useRef } from "react";
import { differenceInMinutes, format, isSameDay } from "date-fns";
import type { Conversation } from "./chat-data";
import { MessageBubble } from "./message-bubble";
import type { MessageActions } from "./message-context-menu";
import { TypingIndicator } from "./typing-indicator";

type MessageListProps = Readonly<{
  conversation: Conversation;
  contactName: string;
  typing: boolean;
  actions: MessageActions;
}>;

/** The messages, with a date line when the day changes. Stays scrolled to the newest one. */
export function MessageList({ conversation, contactName, typing, actions }: MessageListProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const { messages } = conversation;

  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length, typing, conversation.contactId]);

  return (
    <div
      ref={scroller}
      role="log"
      aria-live="polite"
      aria-label={`Conversation with ${contactName}`}
      className="scrollbar-primary min-h-0 flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col gap-1.5">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const next = messages[index + 1];
          const newDay = !previous || !isSameDay(previous.sentAt, message.sentAt);
          // A run ends when the sender changes, the day changes, or five minutes pass.
          const endsRun =
            !next ||
            next.from !== message.from ||
            differenceInMinutes(next.sentAt, message.sentAt) >= 5;
          return (
            <div key={message.id} className="contents">
              {newDay && (
                <p className="my-3 text-center text-xs text-muted-foreground">
                  {format(message.sentAt, "EEEE d MMMM")}
                </p>
              )}
              <MessageBubble
                message={message}
                quoted={
                  message.replyTo ? messages.find((item) => item.id === message.replyTo) : undefined
                }
                showTime={endsRun}
                actions={actions}
              />
            </div>
          );
        })}
        {typing && <TypingIndicator name={contactName} />}
      </div>
    </div>
  );
}
