import { ChartCard } from "../../components/chart-card";
import { LineChart } from "../../widgets/charts";
import { dayLabels, periodStat } from "../../widgets/series";

export function TrafficCard({ days, className }: Readonly<{ days: number; className?: string }>) {
  const views = periodStat(1, days, 1200, 220, 22);
  const labels = dayLabels(days);
  return (
    <ChartCard
      className={className}
      title="Traffic"
      description={`Page views over the last ${days} days, against the ${days} days before.`}
      height={300}
      table={{
        columns: ["Day", "Page views", "Previous period"],
        rows: labels.map((label, index) => [
          label,
          views.series[index] ?? 0,
          views.previousSeries[index] ?? 0,
        ]),
      }}
    >
      <LineChart
        labels={labels}
        lines={[
          { label: "Page views", data: views.series },
          { label: "Previous period", data: views.previousSeries },
        ]}
      />
    </ChartCard>
  );
}
