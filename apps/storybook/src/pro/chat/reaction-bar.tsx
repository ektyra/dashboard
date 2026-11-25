import { cn } from "../../lib/cn";
import { contactById, me } from "./chat-data";
import type { Message } from "./chat-data";

/** The emoji people reacted with, under a message. Click one to add or remove your own. */
export function ReactionBar({
  message,
  onToggle,
}: Readonly<{ message: Message; onToggle: (emoji: string) => void }>) {
  const entries = Object.entries(message.reactions);
  if (entries.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1" aria-label="Reactions">
      {entries.map(([emoji, people]) => {
        const mine = people.includes(me);
        const names = people
          .map((person) => (person === me ? "You" : (contactById(person)?.name ?? "Someone")))
          .join(", ");
        return (
          <li key={emoji}>
            <button
              type="button"
              aria-pressed={mine}
              aria-label={`${emoji} from ${names}. ${mine ? "Click to remove yours" : "Click to add yours"}`}
              title={names}
              onClick={() => onToggle(emoji)}
              className={cn(
                "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border px-2 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                mine ? "border-primary/60 bg-primary/15" : "border-border bg-card hover:bg-muted",
              )}
            >
              <span>{emoji}</span>
              <span className="tabular-nums">{people.length}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
