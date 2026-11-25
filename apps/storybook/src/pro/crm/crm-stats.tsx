import { Banknote, Handshake, Trophy, Users } from "lucide-react";
import { StatCard } from "../../components/stat-card";
import { compact, money, periodStat } from "../../widgets/series";

export function CrmStats({ days }: Readonly<{ days: number }>) {
  const contacts = periodStat(201, days, 24, 7, 0.5);
  const deals = periodStat(202, days, 9, 3, 0.1);
  const pipeline = periodStat(203, days, 4200, 900, 40);
  const won = periodStat(204, days, 1500, 600, 20);
  const label = `vs previous ${days} days`;
  return (
    <>
      <StatCard
        label="New contacts"
        value={compact(contacts.value)}
        change={contacts.change}
        changeLabel={label}
        trend={contacts.trend}
        icon={<Users aria-hidden="true" />}
      />
      <StatCard
        label="Deals opened"
        value={compact(deals.value)}
        change={deals.change}
        changeLabel={label}
        trend={deals.trend}
        icon={<Handshake aria-hidden="true" />}
      />
      <StatCard
        label="Pipeline value"
        value={money(pipeline.value)}
        change={pipeline.change}
        changeLabel={label}
        trend={pipeline.trend}
        icon={<Banknote aria-hidden="true" />}
      />
      <StatCard
        label="Deals won"
        value={money(won.value)}
        change={won.change}
        changeLabel={label}
        trend={won.trend}
        icon={<Trophy aria-hidden="true" />}
      />
    </>
  );
}
