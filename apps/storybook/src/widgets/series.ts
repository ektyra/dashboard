/** Sample numbers for the dashboards. Generated, not real. The same on the server and in the browser. */

function rng(seed: number) {
  let state = seed * 2654435761 + 12345;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** A wavy line with some noise and an optional trend. */
export function makeSeries(
  seed: number,
  length: number,
  base: number,
  amplitude: number,
  trend = 0,
) {
  const random = rng(seed);
  return Array.from({ length }, (_, index) =>
    Math.max(
      0,
      Math.round(
        base +
          trend * index +
          amplitude * Math.sin(index / 2.2 + seed) +
          (random() - 0.5) * amplitude,
      ),
    ),
  );
}

const END = Date.UTC(2026, 10, 18);

/** Short date labels ending today, one per day. */
export function dayLabels(length: number) {
  return Array.from({ length }, (_, index) =>
    new Date(END - (length - 1 - index) * 86_400_000).toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  );
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export type PeriodStat = {
  /** Total for the chosen period. */
  value: number;
  /** Change in percent against the period before it. */
  change: number;
  /** A short series for a sparkline. */
  trend: number[];
  series: number[];
  /** The `days` before, for drawing a comparison line. */
  previousSeries: number[];
};

/** Totals for the last `days` days, compared with the `days` before that. */
export function periodStat(
  seed: number,
  days: number,
  base: number,
  amplitude: number,
  trendPerDay = 0,
): PeriodStat {
  const all = makeSeries(seed, days * 2, base, amplitude, trendPerDay);
  const previous = all.slice(0, days);
  const current = all.slice(days);
  const step = Math.max(1, Math.ceil(current.length / 14));
  const previousTotal = sum(previous) || 1;
  return {
    value: sum(current),
    change: Math.round(((sum(current) - previousTotal) / previousTotal) * 1000) / 10,
    trend: current.filter((_, index) => index % step === 0),
    series: current,
    previousSeries: previous,
  };
}

export const compact = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const money = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
