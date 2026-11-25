import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { DashboardCard } from "../../widgets/dashboard-card";

const rows = [
  { title: "Spring release notes", status: "Published", author: "Alex Morgan", views: 2480 },
  { title: "A better workflow for content", status: "In review", author: "Riley Park", views: 0 },
  { title: "Modeling content in code", status: "Published", author: "Jordan Lee", views: 1860 },
  { title: "Introducing Ektyra", status: "Scheduled", author: "Sam Kowalski", views: 0 },
  { title: "Roles and permissions", status: "Draft", author: "Casey Morgan", views: 0 },
];

const variant = {
  Published: "success",
  "In review": "warning",
  Scheduled: "info",
  Draft: "secondary",
} as const;

export function RecentEntriesCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="Recent entries"
      description="Sample entries."
      className={className}
      contentClassName="pt-0"
      action={
        <Button variant="ghost" size="sm">
          View all
        </Button>
      }
    >
      <Table density="compact" wrapperClassName="border-0 rounded-none">
        <TableHeader className="bg-transparent">
          <TableRow>
            <TableHead className="pl-0">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Author</TableHead>
            <TableHead className="pr-0 text-right">Views</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title}>
              <TableCell className="pl-0">{row.title}</TableCell>
              <TableCell>
                <Badge variant={variant[row.status as keyof typeof variant]}>{row.status}</Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {row.author}
              </TableCell>
              <TableCell className="pr-0 text-right tabular-nums">
                {row.views ? row.views.toLocaleString("en") : "–"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}
