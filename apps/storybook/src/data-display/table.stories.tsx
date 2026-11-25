import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";

const rows = [
  { id: "INV-001", customer: "Acme BV", status: "Paid", amount: "€1,200.00" },
  { id: "INV-002", customer: "Globex", status: "Pending", amount: "€640.00" },
  { id: "INV-003", customer: "Initech", status: "Overdue", amount: "€2,450.00" },
  { id: "INV-004", customer: "Umbrella", status: "Paid", amount: "€310.00" },
];

const tone = { Paid: "success", Pending: "warning", Overdue: "destructive" } as const;

const meta = {
  title: "Data Display/Table",
  component: Table,
  parameters: { layout: "padded" },
  args: { density: "default", striped: false, bordered: false },
  argTypes: {
    density: { control: "inline-radio", options: ["compact", "default", "relaxed"] },
    striped: { control: "boolean" },
    bordered: { control: "boolean" },
  },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Table {...args} className="min-w-[32rem]">
      <TableCaption>Latest invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell>
              <Badge variant={tone[r.status as keyof typeof tone]}>{r.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">€4,600.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Compact: Story = { ...Default, args: { density: "compact", striped: true } };
export const Bordered: Story = { ...Default, args: { bordered: true } };
