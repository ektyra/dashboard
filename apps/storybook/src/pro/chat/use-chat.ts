import { chatActions, chatStore } from "./chat-store";
import type { Conversation } from "./chat-data";

/** Chat state for the chat page: the state lives in `chat-store`, so it survives leaving the page. */
export function useChat() {
  const { conversations, activeId, typing } = chatStore.use();

  const sorted = [...conversations].sort((a, b) => {
    // New, empty chats go to the top until someone writes.
    const time = (conversation: Conversation) =>
      conversation.messages.at(-1)?.sentAt.getTime() ?? Number.MAX_SAFE_INTEGER;
    return time(b) - time(a);
  });

  return {
    conversations: sorted,
    activeId,
    typing,
    ...chatActions,
    open: chatActions.open,
    close: chatActions.close,
  };
}

export type ChatState = ReturnType<typeof useChat>;
