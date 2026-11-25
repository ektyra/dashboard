import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Clock } from "lucide-react";
import { Badge } from "../components/badge";

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "success", "warning", "info"],
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        ["default", "secondary", "outline", "destructive", "success", "warning", "info"] as const
      ).map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="success">
        <Check /> Paid
      </Badge>
      <Badge variant="warning">
        <Clock /> Pending
      </Badge>
    </div>
  ),
};
