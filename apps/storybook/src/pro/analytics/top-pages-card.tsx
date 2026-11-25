import { FileText } from "lucide-react";
import { DashboardCard } from "../../widgets/dashboard-card";
import { periodStat } from "../../widgets/series";
import { RankedList } from "../../widgets/ranked-list";

const pages = ["/blog/launch", "/docs/getting-started", "/pricing", "/blog/schemas", "/about"];

export function TopPagesCard({ days, className }: Readonly<{ days: number; className?: string }>) {
  const items = pages
    .map((page, index) => ({
      label: page,
      value: periodStat(20 + index, days, 160 - index * 24, 30, 1).value,
      icon: <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />,
    }))
    .sort((a, b) => b.value - a.value);
  return (
    <DashboardCard
      title="Top pages"
      description="Most viewed in this period."
      className={className}
    >
      <RankedList items={items} />
    </DashboardCard>
  );
}
