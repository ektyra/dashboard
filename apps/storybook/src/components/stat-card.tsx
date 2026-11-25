import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Sparkline } from "./sparkline";

type StatCardProps = Readonly<{
  label: string;
  value: string;
  /** Change in percent. Positive is shown as good, negative as bad. */
  change?: number;
  /** What the change is compared with, for example "vs last week". */
  changeLabel?: string;
  icon?: ReactNode;
  /** Values for the small trend line. */
  trend?: number[];
}>;

export function StatCard({ label, value, change, changeLabel, icon, trend }: StatCardProps) {
  const up = change !== undefined && change >= 0;
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{label}</span>
          {icon && <span className="[&_svg]:size-4">{icon}</span>}
        </div>
        <p className="text-xl tracking-tight tabular-nums [overflow-wrap:anywhere] min-[24rem]:text-2xl sm:text-3xl">
          {value}
        </p>
        {change !== undefined && (
          <p className="flex items-center gap-2 text-sm">
            <Badge variant={up ? "success" : "destructive"}>
              {up ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
              {up ? "+" : ""}
              {change}%
            </Badge>
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
          </p>
        )}
        {trend && <Sparkline values={trend} className={up ? "text-success" : "text-destructive"} />}
      </CardContent>
    </Card>
  );
}
