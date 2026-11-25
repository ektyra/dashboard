import { Bar, Doughnut, Line } from "react-chartjs-2";
import { chartJsOptions, xyScales } from "../charts/chartjs";
import { useChartTheme } from "../charts/use-chart-theme";
import { withAlpha } from "../lib/css-color";

/** One or more lines over time. The first line gets a soft fill underneath. */
export function LineChart({
  labels,
  lines,
  currency = false,
}: Readonly<{ labels: string[]; lines: { label: string; data: number[] }[]; currency?: boolean }>) {
  const theme = useChartTheme();
  return (
    <Line
      data={{
        labels,
        datasets: lines.map((line, index) => {
          const color = theme.series[index] ?? theme.text;
          return {
            label: line.label,
            data: line.data,
            borderColor: color,
            backgroundColor: withAlpha(color, 0.14),
            fill: index === 0,
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: theme.surface,
            pointHoverBorderWidth: 2,
            borderDash: index > 0 ? [5, 5] : undefined,
          };
        }),
      }}
      options={chartJsOptions<"line">(theme, {
        scales: {
          ...xyScales(theme),
          y: {
            ...xyScales(theme).y,
            ticks: {
              color: theme.muted,
              callback: (value) =>
                currency
                  ? new Intl.NumberFormat("en", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 0,
                    }).format(Number(value))
                  : new Intl.NumberFormat("en", { notation: "compact" }).format(Number(value)),
            },
          },
        },
        plugins: { legend: { display: lines.length > 1 } },
      })}
    />
  );
}

/** Parts of a whole, with a total written in the hole. */
export function DonutChart({
  items,
  totalLabel,
  format = (value) => String(value),
}: Readonly<{
  items: { name: string; value: number }[];
  totalLabel: string;
  format?: (value: number) => string;
}>) {
  const theme = useChartTheme();
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const centerText = {
    id: "centerText",
    afterDraw(chart: {
      ctx: CanvasRenderingContext2D;
      chartArea: { left: number; right: number; top: number; bottom: number };
    }) {
      const { ctx, chartArea } = chart;
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme.text;
      ctx.font = "500 24px Manrope Variable, system-ui, sans-serif";
      ctx.fillText(format(total), x, y - 8);
      ctx.fillStyle = theme.muted;
      ctx.font = "12px Manrope Variable, system-ui, sans-serif";
      ctx.fillText(totalLabel, x, y + 14);
      ctx.restore();
    },
  };
  return (
    <Doughnut
      data={{
        labels: items.map((item) => item.name),
        datasets: [
          {
            data: items.map((item) => item.value),
            backgroundColor: theme.series.slice(0, items.length),
            borderColor: theme.surface,
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      }}
      plugins={[centerText]}
      options={chartJsOptions<"doughnut">(theme, {
        cutout: "70%",
        plugins: { legend: { position: "bottom", align: "center" } },
      })}
    />
  );
}

/** Bars side by side, optionally horizontal. */
export function BarChart({
  labels,
  data,
  label,
  horizontal = false,
  integers = false,
}: Readonly<{
  labels: string[];
  data: number[];
  label: string;
  horizontal?: boolean;
  /** The numbers are counts, so the axis only shows whole numbers. */
  integers?: boolean;
}>) {
  const theme = useChartTheme();
  const base = xyScales(theme);
  const scales = integers
    ? { ...base, y: { ...base.y, ticks: { ...base.y.ticks, precision: 0 } } }
    : base;
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: theme.series[0],
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: 28,
          },
        ],
      }}
      options={chartJsOptions<"bar">(theme, {
        indexAxis: horizontal ? "y" : "x",
        scales: horizontal
          ? {
              x: { ...scales.y, grid: { color: theme.grid } },
              y: { ...scales.x, grid: { display: false } },
            }
          : scales,
        plugins: { legend: { display: false } },
      })}
    />
  );
}
