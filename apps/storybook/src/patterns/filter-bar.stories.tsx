import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/button";
import { Chip } from "../components/chip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { FilterBar } from "./filter-bar";

const meta = {
  title: "Patterns/FilterBar",
  component: FilterBar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { search: "", onSearchChange: () => {}, activeCount: 0, onClear: () => {} },
  render: () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [overdue, setOverdue] = useState(false);
    const active = (search ? 1 : 0) + (status !== "all" ? 1 : 0) + (overdue ? 1 : 0);
    return (
      <div className="w-[44rem]">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search invoices"
          activeCount={active}
          onClear={() => {
            setSearch("");
            setStatus("all");
            setOverdue(false);
          }}
          resultLabel={active ? "7 results" : "24 results"}
          actions={
            <Button variant="outline" size="sm">
              <Download /> Export
            </Button>
          }
        >
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Status" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Chip selected={overdue} onClick={() => setOverdue((v) => !v)}>
            Overdue
          </Chip>
        </FilterBar>
      </div>
    );
  },
};

export const WithActiveFilters: Story = {
  args: {
    search: "acme",
    onSearchChange: () => {},
    activeCount: 2,
    onClear: () => {},
    resultLabel: "3 results",
  },
};
