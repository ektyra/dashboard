import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Search, Settings, Trash2 } from "lucide-react";
import { fn } from "storybook/test";
import { IconButton } from "../components/icon-button";

const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  args: { label: "Notifications", onClick: fn(), children: <Bell /> },
} satisfies Meta<typeof IconButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithShortcut: Story = {
  args: { label: "Search", shortcut: "⌘K", children: <Search /> },
};

export const Group: Story = {
  render: () => (
    <div className="flex gap-1">
      <IconButton label="Settings">
        <Settings />
      </IconButton>
      <IconButton label="Notifications">
        <Bell />
      </IconButton>
      <IconButton label="Delete" className="hover:text-destructive">
        <Trash2 />
      </IconButton>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
