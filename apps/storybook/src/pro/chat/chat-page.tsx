import { useEffect, useState } from "react";
import { PageHeader } from "../../shell/page-header";
import { notify } from "../../toast";
import { cn } from "../../lib/cn";
import { contactById } from "./chat-data";
import { chatActions } from "./chat-store";
import { ChatWindow } from "./chat-window";
import { ConversationList } from "./conversation-list";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { NewChatDialog } from "./new-chat-dialog";
import { useChat } from "./use-chat";

export function ChatPage() {
  const chat = useChat();

  // While this page is showing, messages in the selected conversation are read as they arrive. Elsewhere they count as unread.
  useEffect(() => {
    chatActions.setPageOpen(true);
    return () => chatActions.setPageOpen(false);
  }, []);
  const [deleting, setDeleting] = useState<string>();
  const [newChatOpen, setNewChatOpen] = useState(false);
  const active = chat.conversations.find(
    (conversation) => conversation.contactId === chat.activeId,
  );

  return (
    <>
      <PageHeader
        title="Chat"
        subtitle="Talk to your team. This is a demo: the other people answer with ready-made lines."
      />
      <div className="grid h-[calc(100dvh-17rem)] min-h-[30rem] overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[20rem_minmax(0,1fr)]">
        {/* On small screens one side shows at a time: the list, or the open conversation. */}
        <div className={cn("min-h-0 border-border md:border-r", active && "hidden md:block")}>
          <ConversationList
            conversations={chat.conversations}
            activeId={chat.activeId}
            onOpen={chat.open}
            typing={chat.typing}
            onNewChat={() => setNewChatOpen(true)}
            onMarkUnread={chat.markUnread}
            onDelete={setDeleting}
          />
        </div>
        <div className={cn("min-h-0", !active && "hidden md:block")}>
          {/* The key gives each conversation its own reply and dialog state. */}
          <ChatWindow
            key={active?.contactId ?? "none"}
            conversation={active}
            typing={active ? chat.typing.includes(active.contactId) : false}
            chat={chat}
            onBack={chat.close}
            onDeleteChat={setDeleting}
          />
        </div>
      </div>
      <DeleteChatDialog
        contactId={deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={(contactId) => {
          chat.deleteChat(contactId);
          setDeleting(undefined);
          notify.info("Chat deleted", { description: contactById(contactId)?.name });
        }}
      />
      <NewChatDialog
        open={newChatOpen}
        onOpenChange={setNewChatOpen}
        haveChat={chat.conversations.map((conversation) => conversation.contactId)}
        onStart={chat.startChat}
      />
    </>
  );
}
