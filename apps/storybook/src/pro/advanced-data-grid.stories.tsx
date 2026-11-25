import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AdvancedDataGrid, type GridColumn } from "../components/advanced-data-grid";
import { Badge } from "../components/badge";

type Order = {
  id: number;
  customer: string;
  country: string;
  status: "Paid" | "Pending" | "Refunded";
  total: number;
  date: string;
};

const customers = [
  "Acme BV",
  "Globex",
  "Initech",
  "Umbrella",
  "Hooli",
  "Stark Ltd",
  "Wayne Corp",
  "Wonka",
];
const countries = ["Netherlands", "Germany", "Belgium", "France"];
const statuses = ["Paid", "Pending", "Refunded"] as const;
const seed: Order[] = Array.from({ length: 36 }, (_, i) => ({
  id: 1000 + i,
  customer: customers[i % customers.length]!,
  country: countries[i % countries.length]!,
  status: statuses[(i * 7) % 3]!,
  total: Math.round(80 + ((i * 137) % 900) + (i % 5) * 12.5),
  date: `2026-${String((i % 11) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

const tone = { Paid: "success", Pending: "warning", Refunded: "secondary" } as const;

const columns: GridColumn<Order>[] = [
  { key: "customer", header: "Customer", editable: true, width: "11rem" },
  { key: "country", header: "Country", width: "9rem" },
  {
    key: "status",
    header: "Status",
    cell: (r) => <Badge variant={tone[r.status]}>{r.status}</Badge>,
  },
  { key: "date", header: "Date", width: "8rem" },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (r) => `€${r.total.toLocaleString("en")}`,
  },
];

const meta = {
  title: "Data Display/Advanced DataGrid (Pro)",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [rows, setRows] = useState(seed);
    return (
      <div className="w-[52rem] max-w-full">
        <AdvancedDataGrid
          rows={rows}
          columns={columns}
          exportName="orders"
          groupable={["status", "country"]}
          views={[
            { name: "Pending orders", search: "", groupBy: "status" },
            { name: "Biggest first", sort: { key: "total", dir: "desc" } },
            { name: "By country", groupBy: "country", sort: { key: "customer", dir: "asc" } },
          ]}
          onCellEdit={(row, key, value) =>
            setRows((all) => all.map((r) => (r.id === row.id ? { ...r, [key]: value } : r)))
          }
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  render: () => (
    <div className="w-[52rem] max-w-full">
      <AdvancedDataGrid rows={seed} columns={columns.map((c) => ({ ...c, editable: false }))} />
    </div>
  ),
};
