import { CircleCheck, TriangleAlert } from "lucide-react";
import { DashboardCard } from "../../widgets/dashboard-card";
import { RingProgress } from "../../widgets/ring-progress";

const checks = [
  { label: "Site is up and reachable", ok: true },
  { label: "No broken links", ok: true },
  { label: "SEO fields complete", ok: true },
  { label: "3 images missing alt text", ok: false },
];

export function SiteHealthCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="Content health"
      description="Sample checks, not a live scan."
      className={className}
    >
      <div className="flex flex-wrap items-center gap-6">
        <RingProgress value={92} label="Content health score">
          <div>
            <p className="text-2xl tracking-tight">92%</p>
            <p className="text-xs text-muted-foreground">Healthy</p>
          </div>
        </RingProgress>
        <ul className="grid min-w-0 flex-1 gap-2 text-sm">
          {checks.map((check) => (
            <li key={check.label} className="flex items-start gap-2">
              {check.ok ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-label="Passed" />
              ) : (
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0 text-warning"
                  aria-label="Needs attention"
                />
              )}
              <span>{check.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
}
