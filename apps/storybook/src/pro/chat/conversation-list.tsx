import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { MailMinus, Search, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "../../components/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../components/context-menu";
import { IconButton } from "../../components/icon-button";
import { InputGroup, InputGroupIcon, InputGroupInput } from "../../components/input-group";
import { cn } from "../../lib/cn";
import { contactById, lastMessage, me } from "./chat-data";
import type { Conversation } from "./chat-data";
import { ContactAvatar } from "./contact-avatar";

type ConversationListProps = Readonly<{
  conversations: Conversation[];
  activeId: string | undefined;
  onOpen: (contactId: string) => void;
  typing: string[];
  onNewChat: () => void;
  onMarkUnread: (contactId: string) => void;
  onDelete: (contactId: string) => void;
}>;

/** Time for the list: the hour for the sample "today", otherwise the date. */
const SAMPLE_DAY = new Date(2026, 10, 18);
const stamp = (date: Date) =>
  isSameDay(date, SAMPLE_DAY) ? format(date, "HH:mm") : format(date, "d MMM");

export function ConversationList({
  conversations,
  activeId,
  onOpen,
  typing,
  onNewChat,
  onMarkUnread,
  onDelete,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const shown = conversations.filter((conversation) => {
    const contact = contactById(conversation.contactId);
    if (!contact) return false;
    if (unreadOnly && conversation.unread === 0) return false;
    return contact.name.toLowerCase().includes(search.trim().toLowerCase());
  });
  const unreadTotal = conversations.reduce((total, conversation) => total + conversation.unread, 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid gap-3 border-b border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg tracking-tight">Messages</h2>
          <IconButton label="New chat" onClick={onNewChat}>
            <SquarePen aria-hidden="true" />
          </IconButton>
        </div>
        <InputGroup className="h-9">
          <InputGroupIcon>
            <Search aria-hidden="true" />
          </InputGroupIcon>
          <InputGroupInput
            type="search"
            aria-label="Search conversations"
            placeholder="Search people…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
        <div className="flex gap-1 text-sm" role="group" aria-label="Show">
          {[
            { label: "All", value: false },
            { label: `Unread${unreadTotal ? ` (${unreadTotal})` : ""}`, value: true },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={unreadOnly === tab.value}
              onClick={() => setUnreadOnly(tab.value)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                unreadOnly === tab.value && "bg-muted text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <ul
        className="scrollbar-primary min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-2"
        aria-label="Conversations"
      >
        {shown.map((conversation) => {
          const contact = contactById(conversation.contactId);
          const last = lastMessage(conversation);
          if (!contact) return null;
          const isTyping = typing.includes(contact.id);
          return (
            <li key={contact.id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <button
                    type="button"
                    aria-current={contact.id === activeId ? "true" : undefined}
                    onClick={() => onOpen(contact.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                      contact.id === activeId && "bg-primary/10 hover:bg-primary/10",
                    )}
                  >
                    <ContactAvatar contact={contact} />
                    <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] gap-0.5">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="min-w-0 truncate text-sm">{contact.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {last ? stamp(last.sentAt) : "New"}
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-xs",
                            conversation.unread ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {isTyping
                            ? "typing…"
                            : last
                              ? `${last.from === me ? "You: " : ""}${last.text}`
                              : "No messages yet"}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge className="h-5 min-w-5 shrink-0 justify-center px-1.5">
                            {conversation.unread}
                            <span className="sr-only"> unread</span>
                          </Badge>
                        )}
                      </span>
                    </span>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => onMarkUnread(contact.id)}>
                    <MailMinus aria-hidden="true" />
                    Mark as unread
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    className="text-destructive [&_svg]:text-destructive"
                    onSelect={() => onDelete(contact.id)}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete chat
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">
            {unreadOnly && !search
              ? "Nothing unread. You are all caught up."
              : "Nobody matches that."}
          </li>
        )}
      </ul>
    </div>
  );
}
