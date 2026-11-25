import { ChartCard } from "../../components/chart-card";
import { DonutChart } from "../../widgets/charts";
import { compact, periodStat } from "../../widgets/series";

export function SourcesCard({ days, className }: Readonly<{ days: number; className?: string }>) {
  const items = [
    { name: "Search", value: periodStat(11, days, 620, 90, 8).value },
    { name: "Direct", value: periodStat(12, days, 380, 60, 4).value },
    { name: "Social", value: periodStat(13, days, 210, 70, 2).value },
    { name: "Referral", value: periodStat(14, days, 120, 30, 2).value },
  ];
  return (
    <ChartCard
      className={className}
      title="Where visitors come from"
      description="Share of visits by source."
      height={300}
      table={{ columns: ["Source", "Visits"], rows: items.map((item) => [item.name, item.value]) }}
    >
      <DonutChart items={items} totalLabel="Visits" format={compact} />
    </ChartCard>
  );
}
