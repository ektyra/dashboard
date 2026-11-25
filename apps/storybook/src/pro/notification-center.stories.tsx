import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { sampleConfig } from "../navigation/sample-config";
import { NotificationsPanel } from "../shell/notifications/notifications-panel";
import type { Notification } from "../shell/notifications/notification-types";
import { ActivityFeed } from "../widgets/activity-feed";

const meta = {
  title: "Feedback/Activity feed and notification center (Pro)",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const initial = sampleConfig.useNotifications!().items;

function Center() {
  const [items, setItems] = useState<Notification[]>(initial);
  const unread = items.filter((i) => !i.read).length;
  return (
    <div className="border-border bg-popover w-96 overflow-hidden rounded-xl border shadow-lg">
      <NotificationsPanel
        items={items}
        unread={unread}
        onOpen={(n) =>
          setItems((all) => all.map((i) => (i.id === n.id ? { ...i, read: true } : i)))
        }
        onMarkAllRead={() => setItems((all) => all.map((i) => ({ ...i, read: true })))}
      />
    </div>
  );
}

export const NotificationCenter: Story = { name: "Notification center", render: () => <Center /> };

export const Empty: Story = {
  render: () => (
    <div className="border-border bg-popover w-96 overflow-hidden rounded-xl border shadow-lg">
      <NotificationsPanel items={[]} unread={0} onOpen={() => {}} onMarkAllRead={() => {}} />
    </div>
  ),
};

export const Feed: Story = {
  name: "Activity feed",
  render: () => (
    <div className="border-border bg-card w-96 rounded-xl border p-5">
      <h3 className="mb-4 text-sm font-medium">Recent activity</h3>
      <ActivityFeed
        items={[
          { name: "Grace", initials: "GH", text: "paid invoice INV-004", time: "5 min ago" },
          {
            name: "Alan",
            initials: "AT",
            text: "invited 3 people to Marketing site",
            time: "1 hour ago",
          },
          { name: "Linus", initials: "LT", text: "published “Q3 report”", time: "Yesterday" },
          {
            name: "Margaret",
            initials: "MH",
            text: "commented on Website redesign",
            time: "2 days ago",
          },
        ]}
      />
    </div>
  ),
};
