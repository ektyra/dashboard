import { DashboardCard } from "../../widgets/dashboard-card";
import { periodStat } from "../../widgets/series";
import { RankedList } from "../../widgets/ranked-list";

const authors = ["Alex Morgan", "Jordan Lee", "Riley Park", "Sam Kowalski"];

export function TopAuthorsCard({
  days,
  className,
}: Readonly<{ days: number; className?: string }>) {
  const items = authors
    .map((name, index) => ({
      label: name,
      value: periodStat(30 + index, days, 14 - index * 3, 3).value,
      display: undefined,
    }))
    .sort((a, b) => b.value - a.value)
    .map((item) => ({ ...item, display: `${item.value} entries` }));
  return (
    <DashboardCard
      title="Most active authors"
      description="Entries edited in this period."
      className={className}
    >
      <RankedList items={items} />
    </DashboardCard>
  );
}
