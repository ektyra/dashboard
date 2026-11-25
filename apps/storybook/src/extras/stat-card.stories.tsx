import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Users } from "lucide-react";
import { Bento } from "../components/bento";
import { Card, CardContent } from "../components/card";
import { StatCard } from "../components/stat-card";

const meta = {
  title: "Extras/StatCard and Bento",
  component: StatCard,
  args: {
    label: "Revenue",
    value: "€24,300",
    change: 12.4,
    changeLabel: "vs last month",
    icon: <CreditCard />,
    trend: [3, 5, 4, 8, 7, 11, 10],
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Up: Story = {};
export const Down: Story = {
  args: {
    label: "Customers",
    value: "842",
    change: -1.8,
    icon: <Users />,
    trend: [11, 9, 10, 6, 7, 3, 4],
  },
};
export const Minimal: Story = {
  args: { change: undefined, trend: undefined, icon: undefined, changeLabel: undefined },
};

export const InABento: Story = {
  name: "Bento grid",
  decorators: [
    (Story) => (
      <div className="w-[44rem]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Bento>
      {["Wide tile", "Tile", "Tile", "Tile"].map((t, i) => (
        <Card key={i} className={i === 0 ? "col-span-2" : undefined}>
          <CardContent className="grid h-28 place-items-center text-sm">{t}</CardContent>
        </Card>
      ))}
    </Bento>
  ),
};
