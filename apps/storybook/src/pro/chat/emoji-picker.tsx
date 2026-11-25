import { useState } from "react";
import { Search } from "lucide-react";
import { InputGroup, InputGroupIcon, InputGroupInput } from "../../components/input-group";
import { cn } from "../../lib/cn";
import { emojiCategories } from "./emoji-data";
import { useRecentEmoji } from "./use-recent-emoji";

type EmojiPickerProps = Readonly<{
  onPick: (emoji: string) => void;
}>;

/**
 * Choose an emoji: search by name, jump between groups, and see the ones you used
 * lately first. It is our own small picker, so it looks the same on every system.
 */
export function EmojiPicker({ onPick }: EmojiPickerProps) {
  const { recent, add } = useRecentEmoji();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(emojiCategories[0]?.id ?? "smileys");

  const pick = (emoji: string) => {
    add(emoji);
    onPick(emoji);
  };

  const needle = query.trim().toLowerCase();
  const results = needle
    ? emojiCategories.flatMap((group) => group.emoji).filter((entry) => entry.name.includes(needle))
    : [];
  const active = emojiCategories.find((group) => group.id === category) ?? emojiCategories[0];

  const grid = (items: { char: string; name: string }[]) => (
    <ul className="grid grid-cols-8 gap-0.5" role="listbox" aria-label="Emoji">
      {items.map((entry) => (
        <li key={entry.char} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected="false"
            aria-label={entry.name.split(" ")[0] ?? entry.char}
            title={entry.name.split(" ")[0]}
            onClick={() => pick(entry.char)}
            className="grid size-8 cursor-pointer place-items-center rounded-md text-xl outline-none transition-transform hover:scale-110 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            {entry.char}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid w-72 gap-2">
      <InputGroup className="h-8">
        <InputGroupIcon>
          <Search aria-hidden="true" />
        </InputGroupIcon>
        <InputGroupInput
          type="search"
          aria-label="Search emoji"
          placeholder="Search emoji…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>
      {!needle && (
        <div
          className="flex justify-between border-b border-border pb-1"
          role="tablist"
          aria-label="Emoji groups"
        >
          {emojiCategories.map((group) => (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={group.id === category}
              aria-label={group.label}
              title={group.label}
              onClick={() => setCategory(group.id)}
              className={cn(
                "grid size-8 cursor-pointer place-items-center rounded-md text-base opacity-60 outline-none transition-opacity hover:bg-muted hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
                group.id === category && "bg-muted opacity-100",
              )}
            >
              {group.icon}
            </button>
          ))}
        </div>
      )}
      <div className="scrollbar-primary grid max-h-56 gap-3 overflow-y-auto pr-1">
        {needle ? (
          results.length > 0 ? (
            grid(results)
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No emoji for “{query}”.
            </p>
          )
        ) : (
          <>
            {recent.length > 0 && (
              <section className="grid gap-1">
                <h3 className="text-xs text-muted-foreground">Recently used</h3>
                {grid(recent.map((char) => ({ char, name: char })))}
              </section>
            )}
            {active && (
              <section className="grid gap-1">
                <h3 className="text-xs text-muted-foreground">{active.label}</h3>
                {grid(active.emoji)}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
