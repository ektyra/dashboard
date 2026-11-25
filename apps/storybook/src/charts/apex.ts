import type { ApexOptions } from "apexcharts";
import { deepMerge } from "../lib/deep-merge";
import type { ChartTheme } from "./use-chart-theme";

/**
 * The look every ApexCharts chart shares, taken from the theme: thin marks,
 * quiet grid, no toolbar, a legend at the top, and tooltips on hover. Pass
 * what is different about one chart as `overrides`.
 */
export function apexOptions(theme: ChartTheme, overrides: ApexOptions = {}): ApexOptions {
  const base: ApexOptions = {
    chart: {
      background: "transparent",
      foreColor: theme.muted,
      fontFamily: "inherit",
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: !theme.reduceMotion },
    },
    theme: { mode: theme.mode },
    colors: theme.series,
    dataLabels: { enabled: false },
    stroke: { width: 2, curve: "smooth", lineCap: "round" },
    grid: {
      borderColor: theme.grid,
      strokeDashArray: 3,
      padding: { left: 8, right: 8 },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      labels: { colors: theme.text },
      markers: { size: 6, shape: "circle", strokeWidth: 0, offsetX: -2 },
      itemMargin: { horizontal: 12 },
    },
    tooltip: { theme: theme.mode, style: { fontSize: "13px" } },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { rotate: 0, style: { colors: theme.muted, fontSize: "12px" } },
      crosshairs: { stroke: { color: theme.grid, dashArray: 0 } },
    },
    yaxis: { labels: { style: { colors: theme.muted, fontSize: "12px" } } },
    states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
  };
  return deepMerge(
    base as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as ApexOptions;
}
