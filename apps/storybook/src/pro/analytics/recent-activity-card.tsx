import { Button } from "../../components/button";
import { ActivityFeed } from "../../widgets/activity-feed";
import { DashboardCard } from "../../widgets/dashboard-card";

const items = [
  {
    name: "Alex Morgan",
    initials: "AM",
    text: "published “Spring release notes”",
    time: "2 hours ago",
  },
  { name: "Jordan Lee", initials: "JL", text: "updated the Pricing page", time: "4 hours ago" },
  {
    name: "Riley Park",
    initials: "RP",
    text: "commented on “A better workflow”",
    time: "6 hours ago",
  },
  { name: "Sam Kowalski", initials: "SK", text: "changed the Article model", time: "Yesterday" },
  { name: "Casey Morgan", initials: "CM", text: "uploaded 12 images", time: "Yesterday" },
];

export function RecentActivityCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="Recent activity"
      description="Sample activity."
      className={className}
      action={
        <Button variant="ghost" size="sm">
          View all
        </Button>
      }
    >
      <ActivityFeed items={items} />
    </DashboardCard>
  );
}
