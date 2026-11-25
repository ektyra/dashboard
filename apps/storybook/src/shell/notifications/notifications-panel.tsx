import { BellOff } from "lucide-react";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import type { Notification } from "./notification-types";
import { NotificationItem } from "./notification-item";

type NotificationsPanelProps = Readonly<{
  items: Notification[];
  unread: number;
  onOpen: (notification: Notification) => void;
  onMarkAllRead: () => void;
}>;

/** What opens from the bell: a header with "Mark all as read", then the latest notifications. */
export function NotificationsPanel({
  items,
  unread,
  onOpen,
  onMarkAllRead,
}: NotificationsPanelProps) {
  return (
    <div className="flex max-h-[min(32rem,calc(100dvh-6rem))] flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm">Notifications</h2>
        {unread > 0 && <Badge>{unread} new</Badge>}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          disabled={unread === 0}
          onClick={onMarkAllRead}
        >
          Mark all as read
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="grid place-items-center gap-2 px-6 py-12 text-center text-sm text-muted-foreground">
          <BellOff className="size-6" aria-hidden="true" />
          You are all caught up.
        </div>
      ) : (
        <ul
          className="scrollbar-primary min-h-0 flex-1 overflow-y-auto p-2"
          aria-label="Latest notifications"
        >
          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={() => onOpen(notification)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
