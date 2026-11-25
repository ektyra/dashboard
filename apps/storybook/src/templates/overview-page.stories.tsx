import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { DataTable, DataTableColumnHeader, DataTablePagination } from "../components/data-table";
import { EmptyState } from "../components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { FilterBar } from "../patterns/filter-bar";
import { PageHeader } from "../shell/page-header";
import { dataTableFeatures, type DataTableFeatures } from "../table/features";
import { AppFrame } from "./app-frame";

type Project = {
  id: number;
  name: string;
  owner: string;
  status: "Active" | "On hold" | "Done";
  updated: string;
};

const owners = ["Ada", "Grace", "Linus", "Margaret"];
const states = ["Active", "On hold", "Done"] as const;
const all: Project[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `${["Website", "Portal", "Mobile app", "Reporting", "Billing", "Onboarding"][i % 6]} ${Math.floor(i / 6) + 1}`,
  owner: owners[i % 4]!,
  status: states[i % 3]!,
  updated: `${(i % 9) + 1} days ago`,
}));
const tone = { Active: "success", "On hold": "warning", Done: "secondary" } as const;

const columns: ColumnDef<DataTableFeatures, Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => (
      <Badge variant={tone[getValue<Project["status"]>()]}>{getValue<string>()}</Badge>
    ),
  },
  { accessorKey: "updated", header: "Updated" },
];

function Page({
  loading = false,
  forceEmpty = false,
}: {
  loading?: boolean;
  forceEmpty?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const data = useMemo(
    () =>
      forceEmpty
        ? []
        : all.filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) &&
              (status === "all" || p.status === status),
          ),
    [search, status, forceEmpty],
  );
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  });
  const active = (search ? 1 : 0) + (status !== "all" ? 1 : 0);

  return (
    <AppFrame>
      <PageHeader
        title="Projects"
        subtitle="Everything your team is working on."
        actions={
          <Button>
            <Plus /> New project
          </Button>
        }
      />
      <div className="flex flex-col gap-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search projects"
          activeCount={active}
          onClear={() => {
            setSearch("");
            setStatus("all");
          }}
          resultLabel={loading ? undefined : `${data.length} projects`}
        >
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Status" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>
        {data.length === 0 && !loading ? (
          <EmptyState
            title={forceEmpty ? "No projects yet" : "No projects match"}
            description={
              forceEmpty
                ? "Create your first project to get started."
                : "Try another word or clear your filters."
            }
            action={
              forceEmpty ? (
                <Button>Create project</Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <>
            <Card className="overflow-hidden">
              <DataTable table={table} loading={loading} />
            </Card>
            <DataTablePagination table={table} totalRows={data.length} />
          </>
        )}
      </div>
    </AppFrame>
  );
}

const meta = {
  title: "Templates/OverviewPage",
  parameters: { layout: "fullscreen", initialPath: "/projects" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Page /> };
export const Loading: Story = { render: () => <Page loading /> };
export const Empty: Story = { render: () => <Page forceEmpty /> };
