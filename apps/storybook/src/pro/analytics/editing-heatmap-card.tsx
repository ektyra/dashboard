import { DashboardCard } from "../../widgets/dashboard-card";
import { ActivityHeatmap } from "../../widgets/activity-heatmap";
import { makeSeries } from "../../widgets/series";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const blocks = ["00", "04", "08", "12", "16", "20"];
const shape = [0.05, 0.2, 0.9, 1, 0.65, 0.15];

const values = days.map((_, row) =>
  makeSeries(40 + row, 6, 30, 10).map((noise, column) =>
    Math.round((row < 5 ? 1 : 0.25) * (shape[column] ?? 0) * (noise + 20)),
  ),
);

export function EditingHeatmapCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="When people edit"
      description="Edits by weekday and hour of day."
      className={className}
    >
      <ActivityHeatmap rows={days} columns={blocks} values={values} unit="edits" />
    </DashboardCard>
  );
}
