import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";

type DashboardCardProps = Readonly<{
  title: string;
  description?: string;
  /** Something at the right of the title, such as a "View all" link. */
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}>;

/** A tile for a dashboard: a title row with an optional action, then the content. */
export function DashboardCard({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
