import { Avatar, AvatarFallback } from "../../components/avatar";
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
import { money } from "../../widgets/series";

const deals = [
  {
    name: "Website rebuild",
    company: "Northwind",
    value: 42000,
    closes: "Nov 21",
    stage: "Negotiation",
    owner: "AM",
  },
  {
    name: "Content platform",
    company: "Contoso",
    value: 68000,
    closes: "Nov 24",
    stage: "Proposal",
    owner: "JL",
  },
  {
    name: "Support portal",
    company: "Fabrikam",
    value: 18500,
    closes: "Nov 27",
    stage: "Negotiation",
    owner: "RP",
  },
  {
    name: "Migration project",
    company: "Adventure Works",
    value: 31000,
    closes: "Dec 2",
    stage: "Qualified",
    owner: "SK",
  },
  {
    name: "Docs overhaul",
    company: "Tailspin",
    value: 12400,
    closes: "Dec 5",
    stage: "Proposal",
    owner: "CM",
  },
];

const variant = { Negotiation: "warning", Proposal: "info", Qualified: "secondary" } as const;

export function ClosingSoonCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="Closing soon"
      description="Sample deals and companies."
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
            <TableHead className="pl-0">Deal</TableHead>
            <TableHead className="hidden sm:table-cell">Stage</TableHead>
            <TableHead>Closes</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="w-12 pr-0 text-right">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.name}>
              <TableCell className="pl-0">
                <p>{deal.name}</p>
                <p className="text-xs text-muted-foreground">{deal.company}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={variant[deal.stage as keyof typeof variant]}>{deal.stage}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{deal.closes}</TableCell>
              <TableCell className="text-right tabular-nums">{money(deal.value)}</TableCell>
              <TableCell className="pr-0">
                <Avatar className="ml-auto size-7">
                  <AvatarFallback className="text-[0.65rem]">{deal.owner}</AvatarFallback>
                </Avatar>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}
