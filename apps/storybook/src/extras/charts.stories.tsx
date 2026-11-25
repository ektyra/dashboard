import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "../components/apex-chart";
import { ChartCard } from "../components/chart-card";
import { Sparkline } from "../components/sparkline";
import { apexOptions } from "../charts/apex";
import { useChartTheme } from "../charts/use-chart-theme";

const meta = { title: "Extras/Charts", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const series = [{ name: "Revenue", data: [31, 40, 28, 51, 42, 62] }];

function AreaChart() {
  const theme = useChartTheme();
  const options: ApexOptions = apexOptions(theme, {
    chart: { type: "area" },
    xaxis: { categories: months },
    fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
  });
  return <ApexChart type="area" height={260} series={series} options={options} />;
}

export const ChartInCard: Story = {
  name: "ChartCard (chart and table views)",
  render: () => (
    <div className="w-[34rem]">
      <ChartCard
        title="Revenue"
        description="Last six months, in thousands"
        height={260}
        table={{
          columns: ["Month", "Revenue"],
          rows: months.map((m, i) => [m, series[0]!.data[i]!]),
        }}
      >
        <AreaChart />
      </ChartCard>
    </div>
  ),
};

export const Sparklines: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Sparkline values={[3, 5, 4, 8, 7, 11, 10]} className="text-success h-10 w-32" />
      <Sparkline values={[11, 9, 10, 6, 7, 3, 4]} className="text-destructive h-10 w-32" />
      <Sparkline values={[5, 5, 6, 5, 6, 5, 6]} className="text-primary h-10 w-32" />
    </div>
  ),
};
