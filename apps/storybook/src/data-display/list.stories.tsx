import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../components/badge";
import { RecordTable, SearchInput, SummaryFields } from "../components/records";
import { TableCell, TableRow } from "../components/table";

const meta = { title: "Data Display/List", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

const people = [
  ["Ada Lovelace", "Engineer", "Active"],
  ["Grace Hopper", "Admiral", "Active"],
  ["Alan Turing", "Researcher", "Invited"],
];

export const RecordsList: Story = {
  name: "Record list with search",
  render: () => {
    const [q, setQ] = useState("");
    const rows = people.filter(([n]) => n!.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="flex w-[34rem] flex-col gap-3">
        <SearchInput label="Search people" value={q} onChange={setQ} />
        <RecordTable
          label="People"
          columns={["Name", "Role", { name: "Status", className: "text-right" }]}
          empty={rows.length ? undefined : "Nobody found."}
        >
          {rows.map(([n, r, s]) => (
            <TableRow key={n}>
              <TableCell>{n}</TableCell>
              <TableCell>{r}</TableCell>
              <TableCell className="text-right">
                <Badge variant={s === "Active" ? "success" : "info"}>{s}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </RecordTable>
      </div>
    );
  },
};

export const Summary: Story = {
  name: "Summary fields (definition list)",
  render: () => (
    <div className="w-[30rem]">
      <SummaryFields
        values={[
          ["Name", "Ada Lovelace"],
          ["Email", "ada@example.com"],
          ["Role", "Engineer"],
          ["Notes", ""],
        ]}
      />
    </div>
  ),
};
