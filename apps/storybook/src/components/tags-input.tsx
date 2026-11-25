import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "../lib/cn";

type TagsInputProps = Readonly<{
  value: string[];
  onChange: (tags: string[]) => void;
  /** Existing tags to pick from. Typing narrows them. */
  suggestions?: string[];
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
}>;

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Tags as chips. Pick an existing tag from the list, or type a new one and press Tab, Enter
 * or comma to add it. Backspace in an empty field removes the last tag.
 */
export function TagsInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add a tag",
  id,
  "aria-label": ariaLabel,
  className,
}: TagsInputProps) {
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = text.trim();
  const matches = suggestions
    .filter((tag) => !value.some((used) => same(used, tag)))
    .filter((tag) => !query || tag.toLowerCase().includes(query.toLowerCase()));
  const canCreate = query !== "" && !suggestions.concat(value).some((tag) => same(tag, query));
  const rows = [...matches, ...(canCreate ? [query] : [])];

  function add(tag: string) {
    const clean = tag.trim();
    if (clean && !value.some((used) => same(used, clean))) onChange([...value, clean]);
    setText("");
    setActive(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) =>
        rows.length === 0 ? -1 : (current + step + rows.length) % rows.length,
      );
    } else if (event.key === "Enter" || event.key === "," || (event.key === "Tab" && query)) {
      if (!query && active < 0) return;
      event.preventDefault();
      add(active >= 0 ? (rows[active] ?? query) : query);
    } else if (event.key === "Backspace" && !text && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* A click anywhere in the box focuses the field. */}
      <div
        onClick={() => input.current?.focus()}
        className="flex min-h-9 cursor-text flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-ring"
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-secondary py-0.5 pr-1 pl-2.5 text-xs text-secondary-foreground"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(event) => {
                event.stopPropagation();
                onChange(value.filter((used) => used !== tag));
              }}
              className="grid size-4 cursor-pointer place-items-center rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open && rows.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={text}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(event) => {
            setText(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className="min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && rows.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {rows.map((tag, index) => {
            const creating = canCreate && index === rows.length - 1;
            return (
              <li
                key={`${creating ? "new" : "tag"}-${tag}`}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                // Keep focus in the field so the list does not close before the click lands.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => add(tag)}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  index === active && "bg-accent text-accent-foreground",
                )}
              >
                {creating ? (
                  <>
                    <Plus className="size-4 text-muted-foreground" aria-hidden="true" />
                    Create “{tag}”
                  </>
                ) : (
                  tag
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
