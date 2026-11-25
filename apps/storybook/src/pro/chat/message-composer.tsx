import { useId, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { Button } from "../../components/button";
import { IconButton } from "../../components/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import { Textarea } from "../../components/textarea";
import { notify } from "../../toast";
import type { Message } from "./chat-data";
import { ComposerContextMenu } from "./composer-context-menu";
import { EmojiPicker } from "./emoji-picker";
import { ReplyBar } from "./reply-quote";

type MessageComposerProps = Readonly<{
  contactName: string;
  /** The message being answered, if any. */
  replyTo: Message | undefined;
  onCancelReply: () => void;
  onSend: (text: string) => void;
}>;

/** The box at the bottom. Enter sends, Shift+Enter starts a new line. It has an emoji picker and a right-click menu. */
export function MessageComposer({
  contactName,
  replyTo,
  onCancelReply,
  onSend,
}: MessageComposerProps) {
  const id = useId();
  const field = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  /** Put an emoji where the cursor is, replacing any selected text. */
  const insert = (emoji: string) => {
    const element = field.current;
    const start = element?.selectionStart ?? text.length;
    const end = element?.selectionEnd ?? text.length;
    setText(text.slice(0, start) + emoji + text.slice(end));
    requestAnimationFrame(() => {
      field.current?.focus();
      field.current?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  return (
    <div>
      {replyTo && <ReplyBar message={replyTo} onCancel={onCancelReply} />}
      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <IconButton
          label="Attach a file"
          onClick={() => notify.info("Attachments are not part of this demo")}
        >
          <Paperclip aria-hidden="true" />
        </IconButton>
        <label htmlFor={id} className="sr-only">
          Message {contactName}
        </label>
        {/* The picker opens from the smile button, or from "Insert emoji" in the right-click menu. Both show it above the smile button. */}
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <div className="relative min-w-0 flex-1">
            <ComposerContextMenu
              field={field}
              text={text}
              onChange={setText}
              onOpenEmoji={() => setTimeout(() => setEmojiOpen(true), 50)}
            >
              <Textarea
                id={id}
                ref={field}
                rows={1}
                autoFocus={Boolean(replyTo)}
                value={text}
                placeholder={`Message ${contactName}…`}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                className="block max-h-32 min-h-9 resize-none py-1.5 pr-10 [field-sizing:content]"
              />
            </ComposerContextMenu>
            {/* Inside the box, at its right edge, so it lines up with the other buttons. */}
            <PopoverTrigger asChild>
              <IconButton label="Insert emoji" className="absolute right-0.5 bottom-0.5 size-8">
                <Smile aria-hidden="true" />
              </IconButton>
            </PopoverTrigger>
          </div>
          <PopoverContent
            align="end"
            side="top"
            className="w-auto p-3"
            // The right-click menu hands focus back to the box as it closes. That is not a click away from the picker.
            onInteractOutside={(event) => {
              if (field.current?.contains(event.target as Node)) event.preventDefault();
            }}
          >
            <EmojiPicker onPick={insert} />
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon" aria-label="Send message" disabled={!text.trim()}>
          <SendHorizontal aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
