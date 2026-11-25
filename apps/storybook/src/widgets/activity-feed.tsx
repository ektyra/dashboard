import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "../components/avatar";

export type FeedItem = { name: string; initials: string; text: ReactNode; time: string };

/** Who did what, newest first. */
export function ActivityFeed({ items }: Readonly<{ items: FeedItem[] }>) {
  return (
    <ul className="grid gap-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-[0.7rem]">{item.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-sm">
            <p>
              <span>{item.name}</span> <span className="text-muted-foreground">{item.text}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
