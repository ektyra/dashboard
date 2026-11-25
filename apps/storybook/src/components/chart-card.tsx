import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { cn } from "../lib/cn";

type ChartCardProps = Readonly<{
  title: string;
  description?: string;
  /** The same numbers as the chart, for the "Table" view. Everyone can read a table, including screen readers. */
  table: { columns: string[]; rows: (string | number)[][] };
  /** Height of the chart area in pixels. */
  height?: number;
  className?: string;
  children: ReactNode;
}>;

/**
 * A card around a chart, with a Chart / Table switch. The chart renders only in
 * the browser (chart libraries need it); a placeholder shows until then.
 */
export function ChartCard({
  title,
  description,
  table,
  height = 288,
  className,
  children,
}: ChartCardProps) {
  const titleId = useId();
  const [view, setView] = useState("chart");

  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="grid min-w-0 flex-[1_1_11rem] gap-1">
          <CardTitle id={titleId}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(next) => next && setView(next)}
          aria-label={`${title}: view`}
          className="shrink-0"
        >
          <ToggleGroupItem value="chart" className="h-7 text-xs">
            Chart
          </ToggleGroupItem>
          <ToggleGroupItem value="table" className="h-7 text-xs">
            Table
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {view === "chart" ? (
          <div role="group" aria-labelledby={titleId} style={{ height }} className={cn("w-full")}>
            <ClientOnly fallback={<Skeleton className="size-full" />}>{children}</ClientOnly>
          </div>
        ) : (
          <div
            style={{ maxHeight: height }}
            className="overflow-auto rounded-lg border border-border"
          >
            <Table wrapperClassName="rounded-none border-0" density="compact">
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  {table.columns.map((column, index) => (
                    <TableHead key={column} className={index > 0 ? "text-right" : undefined}>
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row) => (
                  <TableRow key={String(row[0])}>
                    {row.map((cell, index) => (
                      <TableCell
                        key={index}
                        className={index > 0 ? "text-right tabular-nums" : undefined}
                      >
                        {typeof cell === "number" ? cell.toLocaleString("en") : cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
