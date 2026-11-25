import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "../../components/empty-state";
import { contactById } from "./chat-data";
import type { Conversation, Message } from "./chat-data";
import { ChatHeader } from "./chat-header";
import { ForwardDialog } from "./forward-dialog";
import { MessageComposer } from "./message-composer";
import type { MessageActions } from "./message-context-menu";
import { MessageList } from "./message-list";
import { ReactionPickerDialog } from "./reaction-picker-dialog";
import type { ChatState } from "./use-chat";

type ChatWindowProps = Readonly<{
  conversation: Conversation | undefined;
  typing: boolean;
  chat: ChatState;
  onBack: () => void;
  onDeleteChat: (contactId: string) => void;
}>;

/** The open conversation: header, messages and the box to write in, plus the dialogs they open. */
export function ChatWindow({ conversation, typing, chat, onBack, onDeleteChat }: ChatWindowProps) {
  const [replyTo, setReplyTo] = useState<Message>();
  const [forwarding, setForwarding] = useState<Message>();
  const [reactingTo, setReactingTo] = useState<Message>();

  const contact = conversation && contactById(conversation.contactId);
  if (!conversation || !contact) {
    return (
      <div className="grid h-full place-items-center p-6">
        <EmptyState
          icon={<MessagesSquare aria-hidden="true" />}
          title="Pick a conversation"
          description="Choose someone from the list to read and reply."
        />
      </div>
    );
  }

  const actions: MessageActions = {
    onReply: setReplyTo,
    onForward: setForwarding,
    onReact: (message, emoji) => chat.react(contact.id, message.id, emoji),
    onMoreReactions: setReactingTo,
    onDelete: (message) => {
      chat.deleteMessage(contact.id, message.id);
      if (replyTo?.id === message.id) setReplyTo(undefined);
    },
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader
        contact={contact}
        typing={typing}
        onBack={onBack}
        onMarkUnread={() => chat.markUnread(contact.id)}
        onDelete={() => onDeleteChat(contact.id)}
      />
      <MessageList
        conversation={conversation}
        contactName={contact.name}
        typing={typing}
        actions={actions}
      />
      <MessageComposer
        key={contact.id}
        contactName={contact.name}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(undefined)}
        onSend={(text) => {
          chat.send(contact.id, text, replyTo?.id);
          setReplyTo(undefined);
        }}
      />
      <ForwardDialog
        message={forwarding}
        fromContactId={contact.id}
        onClose={() => setForwarding(undefined)}
        onForward={chat.forward}
      />
      <ReactionPickerDialog
        message={reactingTo}
        onClose={() => setReactingTo(undefined)}
        onPick={(message, emoji) => chat.react(contact.id, message.id, emoji)}
      />
    </div>
  );
}
