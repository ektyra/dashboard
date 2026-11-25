import { useId, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";

export type Person = { id: string; name: string };
export type Comment = { id: string; author: Person; text: string; at: string };

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

/** Splits text on @mentions so they can be highlighted. */
function withMentions(text: string, people: Person[]) {
  const names = people.map((p) => p.name.split(" ")[0]!.toLowerCase());
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith("@") && names.includes(part.slice(1).toLowerCase()) ? (
      <span key={i} className="bg-primary/10 text-primary rounded px-1 font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

type CommentThreadProps = Readonly<{
  comments: Comment[];
  people: Person[];
  me: Person;
  onAdd: (text: string) => void;
}>;

/**
 * Comments with @mentions. Type @ to pick a person (arrow keys and Enter). Mentions are
 * highlighted in the thread. The composer is a labelled textarea; the suggestions are a listbox.
 */
export function CommentThread({ comments, people, me, onAdd }: CommentThreadProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const matches =
    query === null
      ? []
      : people.filter(
          (p) =>
            p.name.toLowerCase().startsWith(query.toLowerCase()) ||
            p.name.split(" ")[0]!.toLowerCase().startsWith(query.toLowerCase()),
        );

  const detect = (text: string, caret: number) => {
    const m = /@(\w*)$/.exec(text.slice(0, caret));
    setQuery(m ? m[1]! : null);
    setActive(0);
  };

  const pick = (p: Person) => {
    const el = ref.current;
    if (!el) return;
    const caret = el.selectionStart;
    const before = value.slice(0, caret).replace(/@(\w*)$/, `@${p.name.split(" ")[0]} `);
    const next = before + value.slice(caret);
    setValue(next);
    setQuery(null);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(before.length, before.length);
    });
  };

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    setQuery(null);
  };

  return (
    <section aria-label="Comments" className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-[0.7rem]">{initials(c.author.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <p>
                <span className="font-medium">{c.author.name}</span>{" "}
                <span className="text-muted-foreground text-xs">{c.at}</span>
              </p>
              <p className="text-foreground/90 mt-0.5 leading-6">{withMentions(c.text, people)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="relative flex gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-[0.7rem]">{initials(me.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor={`${id}-box`} className="sr-only">
            Write a comment. Type @ to mention someone.
          </label>
          <textarea
            id={`${id}-box`}
            ref={ref}
            rows={2}
            value={value}
            placeholder="Write a comment… use @ to mention"
            role="combobox"
            aria-expanded={matches.length > 0}
            aria-controls={`${id}-list`}
            aria-activedescendant={matches.length ? `${id}-opt-${active}` : undefined}
            onChange={(e) => {
              setValue(e.target.value);
              detect(e.target.value, e.target.selectionStart);
            }}
            onKeyDown={(e) => {
              if (matches.length) {
                if (e.key === "ArrowDown")
                  (e.preventDefault(), setActive((a) => (a + 1) % matches.length));
                else if (e.key === "ArrowUp")
                  (e.preventDefault(), setActive((a) => (a - 1 + matches.length) % matches.length));
                else if (e.key === "Enter" || e.key === "Tab")
                  (e.preventDefault(), pick(matches[active]!));
                else if (e.key === "Escape") setQuery(null);
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            className="border-input bg-background focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
          />
          {matches.length > 0 && (
            <ul
              id={`${id}-list`}
              role="listbox"
              aria-label="People"
              className="border-border bg-popover absolute bottom-full left-11 z-10 mb-1 w-56 rounded-lg border p-1 shadow-lg"
            >
              {matches.map((p, i) => (
                <li
                  key={p.id}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(p);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    i === active && "bg-accent text-accent-foreground",
                  )}
                >
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[0.55rem]">{initials(p.name)}</AvatarFallback>
                  </Avatar>
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">⌘/Ctrl + Enter to send</span>
            <Button size="sm" onClick={submit} disabled={!value.trim()}>
              <Send /> Comment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
