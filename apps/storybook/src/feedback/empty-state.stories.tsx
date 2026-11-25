import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileSearch, Inbox, Users } from "lucide-react";
import { Button } from "../components/button";
import { EmptyState } from "../components/empty-state";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "No orders yet",
    description: "Orders show up here as soon as a customer checks out.",
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIconAndAction: Story = {
  args: {
    icon: <Inbox />,
    action: <Button>Create an order</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <FileSearch />,
    title: "No results for “invoice”",
    description: "Try another word or clear your filters.",
    action: <Button variant="outline">Clear filters</Button>,
  },
};

export const NoPermission: Story = {
  args: {
    icon: <Users />,
    title: "You do not have access",
    description: "Ask an admin to give you the Reports role.",
  },
};
