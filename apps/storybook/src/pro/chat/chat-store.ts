import { createStore } from "../../lib/store";
import { contactById, initialConversations, me } from "./chat-data";
import type { Conversation, Message } from "./chat-data";

/**
 * Everything about chat lives here, outside any page, so replies keep arriving and
 * the unread count keeps counting when you are on another page.
 */
type ChatState = {
  conversations: Conversation[];
  /** The conversation that is selected (it stays selected when you leave the page). */
  activeId: string | undefined;
  /** Whether the chat page is on screen right now. */
  pageOpen: boolean;
  /** Contacts who are "typing" a reply right now. */
  typing: string[];
};

export const chatStore = createStore<ChatState>({
  conversations: initialConversations,
  activeId: undefined,
  pageOpen: false,
  typing: [],
});

const repliesGiven: Record<string, number> = {};

const edit = (contactId: string, change: (conversation: Conversation) => Conversation) =>
  chatStore.set((state) => ({
    ...state,
    conversations: state.conversations.map((conversation) =>
      conversation.contactId === contactId ? change(conversation) : conversation,
    ),
  }));

/** A conversation is on screen when the chat page is showing and that conversation is the selected one. */
const isOnScreen = (contactId: string) => {
  const state = chatStore.get();
  return state.pageOpen && state.activeId === contactId;
};

/** Add a message. It counts as unread unless that conversation is on screen right now. */
function addMessage(contactId: string, message: Message, fromThem: boolean) {
  edit(contactId, (conversation) => ({
    ...conversation,
    messages: [...conversation.messages, message],
    unread: fromThem && !isOnScreen(contactId) ? conversation.unread + 1 : conversation.unread,
  }));
}

/** Make the other person "type" and then answer with a canned line. This is a demo, not a real chat. */
function scheduleReply(contactId: string) {
  const contact = contactById(contactId);
  if (!contact) return;
  const index = repliesGiven[contactId] ?? 0;
  repliesGiven[contactId] = index + 1;
  const reply = contact.replies[index % contact.replies.length] ?? "";
  setTimeout(
    () => chatStore.set((state) => ({ ...state, typing: [...state.typing, contactId] })),
    700,
  );
  setTimeout(() => {
    chatStore.set((state) => ({
      ...state,
      typing: state.typing.filter((item) => item !== contactId),
    }));
    addMessage(
      contactId,
      { id: `m${Date.now()}r`, from: contactId, text: reply, sentAt: new Date(), reactions: {} },
      true,
    );
  }, 2400);
}

export const chatActions = {
  open: (contactId: string) => {
    chatStore.set((state) => ({ ...state, activeId: contactId }));
    edit(contactId, (conversation) => ({ ...conversation, unread: 0 }));
  },
  close: () => chatStore.set((state) => ({ ...state, activeId: undefined })),
  setPageOpen: (pageOpen: boolean) => chatStore.set((state) => ({ ...state, pageOpen })),

  send: (contactId: string, text: string, replyTo?: string) => {
    addMessage(
      contactId,
      { id: `m${Date.now()}`, from: me, text, sentAt: new Date(), reactions: {}, replyTo },
      false,
    );
    scheduleReply(contactId);
  },

  /** Add your reaction, or take it back if you already used that emoji on the message. */
  react: (contactId: string, messageId: string, emoji: string) =>
    edit(contactId, (conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => {
        if (message.id !== messageId) return message;
        const people = message.reactions[emoji] ?? [];
        const next = people.includes(me)
          ? people.filter((person) => person !== me)
          : [...people, me];
        const { [emoji]: _old, ...rest } = message.reactions;
        return { ...message, reactions: next.length > 0 ? { ...rest, [emoji]: next } : rest };
      }),
    })),

  deleteMessage: (contactId: string, messageId: string) =>
    edit(contactId, (conversation) => ({
      ...conversation,
      // Messages that answered the deleted one lose their quote.
      messages: conversation.messages
        .filter((message) => message.id !== messageId)
        .map((message) =>
          message.replyTo === messageId ? { ...message, replyTo: undefined } : message,
        ),
    })),

  /** Copy a message into other conversations (starting them if needed), marked as forwarded. */
  forward: (message: Message, toIds: string[]) =>
    chatStore.set((state) => {
      let conversations = state.conversations;
      for (const id of toIds) {
        const copy: Message = {
          id: `m${Date.now()}f${id}`,
          from: me,
          text: message.text,
          sentAt: new Date(),
          reactions: {},
          forwarded: true,
        };
        conversations = conversations.some((conversation) => conversation.contactId === id)
          ? conversations.map((conversation) =>
              conversation.contactId === id
                ? { ...conversation, messages: [...conversation.messages, copy] }
                : conversation,
            )
          : [...conversations, { contactId: id, messages: [copy], unread: 0 }];
      }
      return { ...state, conversations };
    }),

  markUnread: (contactId: string) => {
    edit(contactId, (conversation) => ({
      ...conversation,
      unread: Math.max(conversation.unread, 1),
    }));
    if (chatStore.get().activeId === contactId) chatActions.close();
  },

  deleteChat: (contactId: string) =>
    chatStore.set((state) => ({
      ...state,
      conversations: state.conversations.filter(
        (conversation) => conversation.contactId !== contactId,
      ),
      activeId: state.activeId === contactId ? undefined : state.activeId,
    })),

  /** Start a conversation with someone who has none yet, and open it. */
  startChat: (contactId: string) => {
    chatStore.set((state) => ({
      ...state,
      conversations: state.conversations.some(
        (conversation) => conversation.contactId === contactId,
      )
        ? state.conversations
        : [...state.conversations, { contactId, messages: [], unread: 0 }],
      activeId: contactId,
    }));
  },

  markAllRead: () =>
    chatStore.set((state) => ({
      ...state,
      conversations: state.conversations.map((conversation) => ({ ...conversation, unread: 0 })),
    })),
};
