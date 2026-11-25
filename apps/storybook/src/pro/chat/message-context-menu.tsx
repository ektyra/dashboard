import type { ReactNode } from "react";
import { Copy, Forward, Reply, SmilePlus, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../components/context-menu";
import { notify } from "../../toast";
import { quickReactions } from "./emoji-data";
import type { Message } from "./chat-data";

export type MessageActions = {
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onReact: (message: Message, emoji: string) => void;
  onMoreReactions: (message: Message) => void;
  onDelete: (message: Message) => void;
};

/**
 * Right-click (or the Menu key, or Shift+F10 on the focused bubble) opens this menu:
 * a row of quick reactions, then reply, forward, copy and delete.
 */
export function MessageContextMenu({
  message,
  actions,
  children,
}: Readonly<{ message: Message; actions: MessageActions; children: ReactNode }>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <div className="flex justify-between px-1 pb-1" role="group" aria-label="Quick reactions">
          {quickReactions.map((emoji) => (
            <ContextMenuItem
              key={emoji}
              aria-label={`React with ${emoji}`}
              className="size-8 justify-center p-0 text-lg"
              onSelect={() => actions.onReact(message, emoji)}
            >
              {emoji}
            </ContextMenuItem>
          ))}
        </div>
        <ContextMenuItem onSelect={() => actions.onMoreReactions(message)}>
          <SmilePlus aria-hidden="true" />
          More reactions…
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => actions.onReply(message)}>
          <Reply aria-hidden="true" />
          Reply
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => actions.onForward(message)}>
          <Forward aria-hidden="true" />
          Forward…
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => {
            void navigator.clipboard
              .writeText(message.text)
              .then(() => notify.success("Message copied"))
              .catch(() =>
                notify.error("Could not copy", {
                  description: "Select the text and copy it by hand.",
                }),
              );
          }}
        >
          <Copy aria-hidden="true" />
          Copy text
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-destructive [&_svg]:text-destructive"
          onSelect={() => actions.onDelete(message)}
        >
          <Trash2 aria-hidden="true" />
          Delete message
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
