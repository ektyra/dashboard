import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Card } from "../../components/card";
import { EmptyState } from "../../components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { FilterBar } from "../../patterns/filter-bar";
import { PageHeader } from "../../shell/page-header";

type Entry = {
  id: number;
  actor: string;
  action: "Created" | "Updated" | "Deleted" | "Signed in" | "Exported";
  target: string;
  when: string;
  ip: string;
  detail: string;
};

const actors = ["Ada Lovelace", "Grace Hopper", "Alan Turing"];
const actions = ["Created", "Updated", "Deleted", "Signed in", "Exported"] as const;
const targets = [
  "Invoice INV-004",
  "Project Website",
  "User grace@example.com",
  "Report Q3",
  "API key",
  "Settings",
];
const entries: Entry[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  actor: actors[i % 3]!,
  action: actions[(i * 3) % 5]!,
  target: targets[i % targets.length]!,
  when: `${Math.floor(i / 3) + 1}h ago`,
  ip: `192.168.1.${10 + i}`,
  detail: `${actions[(i * 3) % 5]} ${targets[i % targets.length]} from the web app.`,
}));
const tone = {
  Created: "success",
  Updated: "info",
  Deleted: "destructive",
  "Signed in": "secondary",
  Exported: "warning",
} as const;

export function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const rows = useMemo(
    () =>
      entries.filter(
        (e) =>
          `${e.actor} ${e.target}`.toLowerCase().includes(search.toLowerCase()) &&
          (action === "all" || e.action === action),
      ),
    [search, action],
  );
  const active = (search ? 1 : 0) + (action !== "all" ? 1 : 0);
  return (
    <>
      <PageHeader title="Audit log" subtitle="Who did what, and when. Kept for 12 months." />
      <div className="flex flex-col gap-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search people or items"
          activeCount={active}
          onClear={() => {
            setSearch("");
            setAction("all");
          }}
          resultLabel={`${rows.length} events`}
        >
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger aria-label="Action" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState
            title="No events match"
            description="Try another word or clear your filters."
          />
        ) : (
          <Card className="overflow-hidden">
            <Table aria-label="Audit events" wrapperClassName="border-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <span className="sr-only">Details</span>
                  </TableHead>
                  <TableHead>Who</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 12).map((e) => (
                  <>
                    <TableRow key={e.id}>
                      <TableCell>
                        <button
                          type="button"
                          aria-expanded={open === e.id}
                          aria-label={`Details of event ${e.id}`}
                          onClick={() => setOpen(open === e.id ? null : e.id)}
                          className="focus-visible:ring-ring grid size-6 place-items-center rounded outline-none focus-visible:ring-2"
                        >
                          {open === e.id ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[0.6rem]">
                              {e.actor
                                .split(" ")
                                .map((p) => p[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {e.actor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tone[e.action]}>{e.action}</Badge>
                      </TableCell>
                      <TableCell>{e.target}</TableCell>
                      <TableCell className="text-muted-foreground">{e.when}</TableCell>
                    </TableRow>
                    {open === e.id && (
                      <TableRow key={`${e.id}-d`} className="bg-muted/40 hover:bg-muted/40">
                        <TableCell />
                        <TableCell colSpan={4} className="text-muted-foreground text-sm">
                          {e.detail} IP address {e.ip}.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
}
