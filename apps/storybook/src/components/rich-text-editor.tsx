import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { Separator } from "./separator";

type RichTextEditorProps = Readonly<{
  /** Initial content, as HTML. */
  content?: string;
  /** Called with the HTML on every change. */
  onChange?: (html: string) => void;
  className?: string;
  /** `mail` is a lighter toolbar (no headings, code or quotes) and a shorter box. */
  variant?: "full" | "mail";
  /** Put the cursor at the start or the end of the text when the editor appears. */
  autoFocus?: "start" | "end";
  /** Accessible name for the text area. */
  label?: string;
}>;

function Toolbar({ editor, variant }: Readonly<{ editor: Editor; variant: "full" | "mail" }>) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      strike: current.isActive("strike"),
      underline: current.isActive("underline"),
      heading: current.isActive("heading", { level: 2 }),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      blockquote: current.isActive("blockquote"),
      code: current.isActive("code"),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });

  const tool = (
    label: string,
    icon: React.ReactNode,
    active: boolean,
    run: () => void,
    shortcut?: string,
  ) => (
    <IconButton
      label={label}
      shortcut={shortcut}
      aria-pressed={active}
      onClick={run}
      className={cn("size-8", active && "bg-accent text-accent-foreground")}
    >
      {icon}
    </IconButton>
  );

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5"
    >
      {tool(
        "Bold",
        <Bold aria-hidden="true" />,
        state.bold,
        () => editor.chain().focus().toggleBold().run(),
        "⌘B",
      )}
      {tool(
        "Italic",
        <Italic aria-hidden="true" />,
        state.italic,
        () => editor.chain().focus().toggleItalic().run(),
        "⌘I",
      )}
      {tool(
        "Underline",
        <Underline aria-hidden="true" />,
        state.underline,
        () => editor.chain().focus().toggleUnderline().run(),
        "⌘U",
      )}
      {variant === "full" && (
        <>
          {tool("Strikethrough", <Strikethrough aria-hidden="true" />, state.strike, () =>
            editor.chain().focus().toggleStrike().run(),
          )}
          {tool("Code", <Code aria-hidden="true" />, state.code, () =>
            editor.chain().focus().toggleCode().run(),
          )}
        </>
      )}
      <Separator orientation="vertical" className="mx-1" />
      {variant === "full" &&
        tool("Heading", <Heading2 aria-hidden="true" />, state.heading, () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        )}
      {tool("Bullet list", <List aria-hidden="true" />, state.bulletList, () =>
        editor.chain().focus().toggleBulletList().run(),
      )}
      {tool("Numbered list", <ListOrdered aria-hidden="true" />, state.orderedList, () =>
        editor.chain().focus().toggleOrderedList().run(),
      )}
      {variant === "full" &&
        tool("Quote", <Quote aria-hidden="true" />, state.blockquote, () =>
          editor.chain().focus().toggleBlockquote().run(),
        )}
      <Separator orientation="vertical" className="mx-1" />
      <IconButton
        label="Undo"
        className="size-8"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 aria-hidden="true" />
      </IconButton>
      <IconButton
        label="Redo"
        className="size-8"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 aria-hidden="true" />
      </IconButton>
    </div>
  );
}

/** A rich text editor (Tiptap) with a toolbar. Content in and out is HTML. */
export function RichTextEditor({
  content = "",
  onChange,
  className,
  variant = "full",
  autoFocus,
  label = "Rich text editor",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    // Needed for server rendering: the editor mounts after hydration.
    immediatelyRender: false,
    autofocus: autoFocus ?? false,
    editorProps: {
      attributes: {
        "aria-label": label,
        class: cn("rich-text p-4 outline-none", variant === "mail" ? "min-h-48" : "min-h-40"),
      },
    },
    onUpdate: ({ editor: current }) => onChange?.(current.getHTML()),
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    >
      {editor ? (
        <Toolbar editor={editor} variant={variant} />
      ) : (
        <div className="h-[3.25rem] border-b border-border" />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
