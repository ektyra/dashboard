import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "../components/apex-chart";
import { ChartCard } from "../components/chart-card";
import { apexOptions } from "../charts/apex";
import { useChartTheme } from "../charts/use-chart-theme";

const meta = {
  title: "Data Display/Chart suite (Pro)",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function Chart({
  type,
  series,
  overrides,
  height = 260,
  mono = false,
}: {
  mono?: boolean;
  type: "area" | "bar" | "donut" | "heatmap";
  series: ApexOptions["series"];
  overrides?: ApexOptions;
  height?: number;
}) {
  const theme = useChartTheme();
  return (
    <ApexChart
      type={type}
      height={height}
      series={series}
      options={apexOptions(theme, {
        chart: { type },
        ...overrides,
        ...(mono
          ? {
              plotOptions: {
                heatmap: {
                  radius: 4,
                  colorScale: {
                    // A one-hue ramp, so darker always means busier.
                    ranges: theme.ramp(5).map((color, i) => ({
                      from: i * 20,
                      to: i === 4 ? 100 : i * 20 + 19,
                      color,
                    })),
                  },
                },
              },
            }
          : {}),
      })}
    />
  );
}

function Suite() {
  const trend = [31, 40, 28, 51, 42, 62, 55, 71];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heat = days.map((d, i) => ({
    name: d,
    data: Array.from({ length: 12 }, (_, h) => ({
      x: `${h * 2}h`,
      y: Math.round(Math.abs(Math.sin((i + 1) * (h + 1))) * 100),
    })),
  }));
  const funnel = [
    ["Visits", 12400],
    ["Signups", 4300],
    ["Trials", 2100],
    ["Paid", 780],
  ] as const;
  return (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <ChartCard
        title="Revenue"
        description="Area, last 8 months"
        height={260}
        table={{ columns: ["Month", "Revenue"], rows: months.map((m, i) => [m, trend[i]!]) }}
      >
        <Chart
          type="area"
          series={[{ name: "Revenue", data: trend }]}
          overrides={{
            xaxis: { categories: months },
            fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
          }}
        />
      </ChartCard>
      <ChartCard
        title="Orders by month"
        description="Grouped bars"
        height={260}
        table={{
          columns: ["Month", "Online", "Retail"],
          rows: months.map((m, i) => [m, trend[i]!, Math.round(trend[i]! * 0.6)]),
        }}
      >
        <Chart
          type="bar"
          series={[
            { name: "Online", data: trend },
            { name: "Retail", data: trend.map((v) => Math.round(v * 0.6)) },
          ]}
          overrides={{
            xaxis: { categories: months },
            plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
          }}
        />
      </ChartCard>
      <ChartCard
        title="Sales by channel"
        description="Donut"
        height={260}
        table={{
          columns: ["Channel", "Orders"],
          rows: [
            ["Online", 540],
            ["Retail", 320],
            ["Partners", 180],
          ],
        }}
      >
        <Chart
          type="donut"
          series={[540, 320, 180]}
          overrides={{ labels: ["Online", "Retail", "Partners"], legend: { position: "bottom" } }}
        />
      </ChartCard>
      <ChartCard
        title="Conversion funnel"
        description="Horizontal bars, widest first"
        height={260}
        table={{ columns: ["Step", "People"], rows: funnel.map(([s, v]) => [s, v]) }}
      >
        <Chart
          type="bar"
          series={[{ name: "People", data: funnel.map(([, v]) => v) }]}
          overrides={{
            xaxis: { categories: funnel.map(([s]) => s) },
            plotOptions: {
              bar: { horizontal: true, borderRadius: 4, distributed: true, barHeight: "70%" },
            },
            legend: { show: false },
          }}
        />
      </ChartCard>
      <div className="lg:col-span-2">
        <ChartCard
          title="Activity by hour"
          description="Heatmap: darker is busier"
          height={300}
          table={{
            columns: ["Day", ...heat[0]!.data.map((d) => d.x)],
            rows: heat.map((r) => [r.name, ...r.data.map((d) => d.y)]),
          }}
        >
          <Chart
            type="heatmap"
            mono
            height={300}
            series={heat}
            overrides={{
              legend: { show: false },
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}

export const Suite_: Story = { name: "All charts", render: () => <Suite /> };
