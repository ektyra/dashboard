import { DashboardCard } from "../../widgets/dashboard-card";
import { money } from "../../widgets/series";

const stages = [
  { name: "Lead", count: 42, value: 128000 },
  { name: "Qualified", count: 28, value: 196000 },
  { name: "Proposal", count: 15, value: 212000 },
  { name: "Negotiation", count: 9, value: 164000 },
  { name: "Won", count: 6, value: 88000 },
];

export function PipelineCard({ className }: Readonly<{ className?: string }>) {
  const max = Math.max(...stages.map((stage) => stage.value));
  return (
    <DashboardCard
      title="Pipeline"
      description="Open deals by stage. Sample data."
      className={className}
    >
      <ol className="grid gap-3 sm:grid-cols-5">
        {stages.map((stage, index) => (
          <li
            key={stage.name}
            className="grid content-between gap-3 rounded-xl border border-border p-4"
          >
            <div>
              <p className="text-sm text-muted-foreground">{stage.name}</p>
              <p className="mt-1 text-2xl tracking-tight tabular-nums">{stage.count}</p>
              <p className="text-sm tabular-nums">{money(stage.value)}</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
              <div
                className={`h-full rounded-full ${stage.name === "Won" ? "bg-success" : "bg-primary"}`}
                style={{
                  width: `${(stage.value / max) * 100}%`,
                  opacity: stage.name === "Won" ? 1 : 1 - index * 0.1,
                }}
              />
            </div>
          </li>
        ))}
      </ol>
    </DashboardCard>
  );
}
