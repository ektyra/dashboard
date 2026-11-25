import { Eye, Mail, MousePointerClick, Users } from "lucide-react";
import { StatCard } from "../../components/stat-card";
import { compact, periodStat } from "../../widgets/series";

/** Four headline numbers for the chosen period, each against the period before. */
export function AnalyticsStats({ days }: Readonly<{ days: number }>) {
  const views = periodStat(1, days, 1200, 220, 22);
  const visitors = periodStat(2, days, 520, 110, 9);
  const reads = periodStat(3, days, 340, 80, 6);
  const signups = periodStat(4, days, 14, 6, 0.2);
  const label = `vs previous ${days} days`;

  return (
    <>
      <StatCard
        label="Page views"
        value={compact(views.value)}
        change={views.change}
        changeLabel={label}
        trend={views.trend}
        icon={<Eye aria-hidden="true" />}
      />
      <StatCard
        label="Visitors"
        value={compact(visitors.value)}
        change={visitors.change}
        changeLabel={label}
        trend={visitors.trend}
        icon={<Users aria-hidden="true" />}
      />
      <StatCard
        label="Full reads"
        value={compact(reads.value)}
        change={reads.change}
        changeLabel={label}
        trend={reads.trend}
        icon={<MousePointerClick aria-hidden="true" />}
      />
      <StatCard
        label="Newsletter signups"
        value={compact(signups.value)}
        change={signups.change}
        changeLabel={label}
        trend={signups.trend}
        icon={<Mail aria-hidden="true" />}
      />
    </>
  );
}
