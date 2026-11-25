import type { ReactNode, RefObject } from "react";
import { ClipboardPaste, Copy, MousePointerSquareDashed, Scissors, Smile } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../components/context-menu";
import { notify } from "../../toast";

type ComposerContextMenuProps = Readonly<{
  field: RefObject<HTMLTextAreaElement | null>;
  text: string;
  onChange: (text: string) => void;
  onOpenEmoji: () => void;
  children: ReactNode;
}>;

/**
 * The menu for the message box. Browsers keep their own menu out of reach once you
 * replace it, so this one brings back the basics (cut, copy, paste, select all) and
 * adds an emoji item.
 */
export function ComposerContextMenu({
  field,
  text,
  onChange,
  onOpenEmoji,
  children,
}: ComposerContextMenuProps) {
  const selection = () => {
    const element = field.current;
    if (!element) return { start: 0, end: 0, chosen: "" };
    return {
      start: element.selectionStart,
      end: element.selectionEnd,
      chosen: text.slice(element.selectionStart, element.selectionEnd),
    };
  };

  const copy = async (cut: boolean) => {
    const { start, end, chosen } = selection();
    if (!chosen) return;
    try {
      await navigator.clipboard.writeText(chosen);
      if (cut) onChange(text.slice(0, start) + text.slice(end));
    } catch {
      notify.error("Could not use the clipboard", {
        description: "Use the keyboard shortcut instead.",
      });
    }
  };

  const paste = async () => {
    try {
      const pasted = await navigator.clipboard.readText();
      const { start, end } = selection();
      onChange(text.slice(0, start) + pasted + text.slice(end));
      // Put the cursor after what was pasted once React has updated the box.
      requestAnimationFrame(() => {
        field.current?.focus();
        field.current?.setSelectionRange(start + pasted.length, start + pasted.length);
      });
    } catch {
      notify.error("Could not read the clipboard", {
        description: "Your browser may be blocking it. Use Ctrl+V or ⌘V instead.",
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onSelect={onOpenEmoji}>
          <Smile aria-hidden="true" />
          Insert emoji…
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => void copy(true)}>
          <Scissors aria-hidden="true" />
          Cut
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => void copy(false)}>
          <Copy aria-hidden="true" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => void paste()}>
          <ClipboardPaste aria-hidden="true" />
          Paste
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => {
            field.current?.focus();
            field.current?.select();
          }}
        >
          <MousePointerSquareDashed aria-hidden="true" />
          Select all
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
