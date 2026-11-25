import { cn } from "../lib/cn";

type ActivityHeatmapProps = Readonly<{
  rows: string[];
  columns: string[];
  /** One list per row, one number per column. */
  values: number[][];
  unit: string;
  className?: string;
}>;

/**
 * A grid of squares, darker where the number is higher. One hue, light to dark.
 * Each square has a text title for hover, and the grid has a summary for screen readers.
 */
export function ActivityHeatmap({ rows, columns, values, unit, className }: ActivityHeatmapProps) {
  const max = Math.max(1, ...values.flat());
  const busiest = values
    .flatMap((row, rowIndex) => row.map((value, columnIndex) => ({ value, rowIndex, columnIndex })))
    .sort((a, b) => b.value - a.value)[0];

  return (
    <div className={cn("grid gap-2", className)}>
      <div
        role="img"
        aria-label={`${unit} by day and time. Busiest: ${rows[busiest?.rowIndex ?? 0]} ${columns[busiest?.columnIndex ?? 0]}, ${busiest?.value ?? 0}.`}
        className="grid gap-1"
        style={{ gridTemplateColumns: `2rem repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        <span />
        {columns.map((column) => (
          <span key={column} className="truncate text-center text-[0.65rem] text-muted-foreground">
            {column}
          </span>
        ))}
        {rows.map((row, rowIndex) => (
          <div key={row} className="contents">
            <span className="self-center text-[0.65rem] text-muted-foreground">{row}</span>
            {columns.map((column, columnIndex) => {
              const value = values[rowIndex]?.[columnIndex] ?? 0;
              const strength = value / max;
              return (
                <span
                  key={column}
                  title={`${row}, ${column}: ${value} ${unit}`}
                  className="aspect-[5/3] rounded-md"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--primary) ${Math.round(8 + strength * 82)}%, var(--card))`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-end gap-2 text-[0.65rem] text-muted-foreground"
        aria-hidden="true"
      >
        Less
        {[0.1, 0.35, 0.6, 0.85].map((strength) => (
          <span
            key={strength}
            className="size-3 rounded-sm"
            style={{
              backgroundColor: `color-mix(in oklab, var(--primary) ${Math.round(8 + strength * 82)}%, var(--card))`,
            }}
          />
        ))}
        More
      </div>
    </div>
  );
}
