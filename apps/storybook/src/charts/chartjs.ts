import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { deepMerge } from "../lib/deep-merge";
import type { ChartTheme } from "./use-chart-theme";

// Chart.js only includes what you register. These are the parts the demos use.
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
);

/** What every Chart.js chart shares, from the theme: a top legend, a dark tooltip, a quiet grid. */
export function chartJsOptions<T extends "line" | "bar" | "doughnut" | "radar">(
  theme: ChartTheme,
  overrides?: ChartOptions<T>,
): ChartOptions<T> {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    animation: theme.reduceMotion ? false : { duration: 500 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: theme.text,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
          font: { size: 13 },
        },
      },
      tooltip: {
        // An inverted tooltip: light text on dark in light mode, and the other way round.
        backgroundColor: theme.text,
        titleColor: theme.surface,
        bodyColor: theme.surface,
        padding: 10,
        cornerRadius: 8,
        boxPadding: 4,
      },
    },
  };
  return deepMerge(
    base as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as ChartOptions<T>;
}

/** Axes for line and bar charts: no vertical grid, a quiet horizontal one, no axis lines. */
export function xyScales(theme: ChartTheme, stacked = false) {
  return {
    x: {
      stacked,
      grid: { display: false },
      border: { display: false },
      ticks: { color: theme.muted, maxRotation: 0, autoSkipPadding: 16 },
    },
    y: {
      stacked,
      beginAtZero: true,
      grid: { color: theme.grid },
      border: { display: false },
      ticks: { color: theme.muted },
    },
  };
}
