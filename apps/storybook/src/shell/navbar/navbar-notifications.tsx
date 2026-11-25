import { useState } from "react";
import { Bell } from "lucide-react";
import { IconButton } from "../../components/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import { NotificationsPanel } from "../notifications/notifications-panel";
import { useNotificationsState } from "../config/layout-config";

/**
 * The bell. A badge shows how many things are unread (emails, chats and more). When
 * the page loads with something unread, the bell rings for two seconds. Clicking it
 * opens the latest notifications.
 */
export function NavbarNotifications() {
  const [open, setOpen] = useState(false);
  const { items, unread, open: openNotification, markAllRead } = useNotificationsState();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}>
          <Bell
            className={unread > 0 ? "animate-bell motion-reduce:animate-none" : undefined}
            aria-hidden="true"
          />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[0.6rem] leading-none text-white tabular-nums ring-2 ring-background"
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(26rem,calc(100vw-1.5rem))] p-0">
        <NotificationsPanel
          items={items}
          unread={unread}
          onOpen={(notification) => {
            setOpen(false);
            openNotification(notification);
          }}
          onMarkAllRead={markAllRead}
        />
      </PopoverContent>
    </Popover>
  );
}
