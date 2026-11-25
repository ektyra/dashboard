import { useMemo } from "react";
import { mixRgb, readToken } from "../lib/css-color";
import { useDocumentTheme } from "../lib/use-document-theme";

export type ChartTheme = {
  mode: "light" | "dark";
  /** The eight categorical colors, in order. Use them in order and never skip. */
  series: string[];
  /** Primary text. */
  text: string;
  /** Axis labels and legends. */
  muted: string;
  /** Grid lines and axes: quiet. */
  grid: string;
  /** The color behind the chart. Used for gaps between slices and bars. */
  surface: string;
  reduceMotion: boolean;
  /** A one-hue ramp from nearly the surface to the full first series color, for magnitude (heatmaps). */
  ramp: (steps: number) => string[];
};

/**
 * The theme's colors as plain rgb, for chart libraries that cannot read CSS
 * variables or oklch. It recomputes when the theme changes. Only call it in a
 * component that renders in the browser (it reads the page's styles).
 */
export function useChartTheme(): ChartTheme {
  const resolvedTheme = useDocumentTheme();
  return useMemo(() => {
    const series = Array.from({ length: 8 }, (_, index) => readToken(`--chart-${index + 1}`));
    const surface = readToken("--card");
    const first = series[0] ?? "rgb(98, 80, 214)";
    return {
      mode: resolvedTheme,
      series,
      text: readToken("--foreground"),
      muted: readToken("--muted-foreground"),
      grid: readToken("--border"),
      surface,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ramp: (steps) =>
        Array.from({ length: steps }, (_, index) =>
          mixRgb(first, surface, 0.18 + (0.82 * index) / Math.max(1, steps - 1)),
        ),
    };
  }, [resolvedTheme]);
}
