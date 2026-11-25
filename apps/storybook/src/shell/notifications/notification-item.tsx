import { format, isSameDay } from "date-fns";
import { Badge } from "../../components/badge";
import { cn } from "../../lib/cn";
import { typeInfo } from "./notification-types";
import type { Notification } from "./notification-types";

const SAMPLE_DAY = new Date(2026, 10, 18);
const when = (date: Date) =>
  isSameDay(date, SAMPLE_DAY) ? format(date, "HH:mm") : format(date, "d MMM");

/** One line in the bell's list: an icon, a type badge, who or what, and when. */
export function NotificationItem({
  notification,
  onOpen,
}: Readonly<{ notification: Notification; onOpen: () => void }>) {
  const info = typeInfo[notification.type];
  const Icon = info.icon;
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
          !notification.read && "bg-primary/5",
        )}
      >
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] gap-1">
          <span className="flex items-center gap-2">
            <Badge variant={info.variant} className="px-1.5 py-0 text-[0.65rem]">
              {info.label}
            </Badge>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
              {when(notification.at)}
            </span>
            {!notification.read && (
              <span className="size-2 shrink-0 rounded-full bg-primary">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </span>
          <span className={cn("truncate text-sm", notification.read && "text-muted-foreground")}>
            {notification.title}
          </span>
          <span className="line-clamp-2 text-xs text-muted-foreground">{notification.text}</span>
        </span>
      </button>
    </li>
  );
}
