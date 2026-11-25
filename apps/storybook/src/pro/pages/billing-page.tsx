import { CreditCard, Download } from "lucide-react";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Progress } from "../../components/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { PageHeader } from "../../shell/page-header";

const invoices = [
  ["INV-2026-011", "1 Nov 2026", "€49.00", "Paid"],
  ["INV-2026-010", "1 Oct 2026", "€49.00", "Paid"],
  ["INV-2026-009", "1 Sep 2026", "€49.00", "Paid"],
  ["INV-2026-008", "1 Aug 2026", "€49.00", "Refunded"],
] as const;

const usage = [
  ["Seats", 8, 10],
  ["Storage (GB)", 62, 100],
  ["API calls (thousands)", 840, 1000],
] as const;

export function BillingPage() {
  return (
    <>
      <PageHeader
        title="Billing"
        subtitle="Your plan, usage and invoices."
        actions={<Button variant="outline">Manage in portal</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team plan</CardTitle>
            <CardDescription>€49 per month · renews on 1 December 2026</CardDescription>
            <CardAction>
              <Badge variant="success">Active</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-5">
            {usage.map(([label, used, max]) => (
              <div key={label} className="grid gap-1.5">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {used} of {max}
                  </span>
                </div>
                <Progress value={(used / max) * 100} aria-label={`${label} used`} />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button>Upgrade plan</Button>
              <Button variant="outline">Cancel plan</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment method</CardTitle>
            <CardDescription>Used for the next invoice.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="border-border flex items-center gap-3 rounded-lg border p-3">
              <span className="bg-muted grid size-10 place-items-center rounded-md">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>
              <div className="text-sm">
                <p>Visa ending 4242</p>
                <p className="text-muted-foreground text-xs">Expires 08/2028</p>
              </div>
            </div>
            <Button variant="outline">Update card</Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table aria-label="Invoices" wrapperClassName="border-0">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Download</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(([id, date, amount, status]) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell className="tabular-nums">{amount}</TableCell>
                    <TableCell>
                      <Badge variant={status === "Paid" ? "success" : "secondary"}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" aria-label={`Download ${id}`}>
                        <Download /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
