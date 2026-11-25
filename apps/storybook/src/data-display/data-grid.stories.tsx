import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@tanstack/react-table";
import { Badge } from "../components/badge";
import {
  DataTable,
  DataTablePagination,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableViewOptions,
} from "../components/data-table";
import { Checkbox } from "../components/checkbox";
import { dataTableFeatures, type DataTableFeatures } from "../table/features";

type Person = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  logins: number;
};

const names = [
  "Ada",
  "Grace",
  "Linus",
  "Margaret",
  "Alan",
  "Barbara",
  "Dennis",
  "Edsger",
  "Frances",
  "Ken",
  "Radia",
  "Tim",
];
const roles = ["Admin", "Editor", "Viewer"];
const statuses = ["Active", "Invited", "Suspended"] as const;
const people: Person[] = names.map((name, i) => ({
  id: i + 1,
  name,
  role: roles[i % 3]!,
  status: statuses[i % 3]!,
  logins: (i * 37) % 120,
}));

const tone = { Active: "success", Invited: "info", Suspended: "destructive" } as const;

const columns: ColumnDef<DataTableFeatures, Person>[] = [
  {
    id: "select",
    header: ({ table }) => <DataTableSelectAll table={table} />,
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(v === true)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => {
      const v = getValue<Person["status"]>();
      return <Badge variant={tone[v]}>{v}</Badge>;
    },
  },
  {
    accessorKey: "logins",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Logins" />,
    cell: ({ getValue }) => <span className="tabular-nums">{getValue<number>()}</span>,
  },
];

function Grid({
  data,
  loading = false,
  pageSize = 5,
}: {
  data: Person[];
  loading?: boolean;
  pageSize?: number;
}) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });
  return (
    <div className="flex w-[40rem] flex-col gap-3">
      <div className="flex justify-end">
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} loading={loading} emptyMessage="No people match." />
      <DataTablePagination table={table} totalRows={data.length} />
    </div>
  );
}

const meta = {
  title: "Data Display/DataGrid",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Grid data={people} /> };
export const Loading: Story = { render: () => <Grid data={people} loading /> };
export const Empty: Story = { render: () => <Grid data={[]} /> };
