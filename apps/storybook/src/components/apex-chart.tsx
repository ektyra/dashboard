import { Suspense, lazy } from "react";
import type { ComponentProps } from "react";
import { Skeleton } from "./skeleton";

// ApexCharts touches `window` when it loads, so it is only imported in the browser.
const ReactApexChart = lazy(() => import("react-apexcharts"));

/**
 * A chart from ApexCharts. Only render it where the browser is available
 * (inside a `ChartCard`, which does that for you). Give it `height` in pixels.
 */
export function ApexChart(props: ComponentProps<typeof ReactApexChart>) {
  return (
    <Suspense
      fallback={<Skeleton className="w-full" style={{ height: Number(props.height) || 280 }} />}
    >
      <ReactApexChart width="100%" {...props} />
    </Suspense>
  );
}
