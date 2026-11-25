import { ChartCard } from "../../components/chart-card";
import { BarChart } from "../../widgets/charts";

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const won = [8, 11, 9, 14, 12, 16];

export function DealsChartCard({ className }: Readonly<{ className?: string }>) {
  return (
    <ChartCard
      className={className}
      title="Deals won per month"
      description="Sample data."
      height={280}
      table={{
        columns: ["Month", "Deals won"],
        rows: months.map((month, index) => [month, won[index] ?? 0]),
      }}
    >
      <BarChart labels={months} data={won} label="Deals won" />
    </ChartCard>
  );
}
