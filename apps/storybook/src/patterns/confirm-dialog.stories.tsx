import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../components/button";
import { ConfirmDialog } from "./confirm-dialog";

const meta = {
  title: "Patterns/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    trigger: <Button variant="outline">Delete invoice</Button>,
    title: "Delete invoice INV-004?",
    description: "The invoice for Umbrella (€310.00) will be removed. This cannot be undone.",
    confirmLabel: "Delete invoice",
    destructive: true,
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {};

export const NonDestructive: Story = {
  args: {
    trigger: <Button>Publish</Button>,
    title: "Publish this page?",
    description: "Everyone with the link can see it right away. You can unpublish later.",
    confirmLabel: "Publish page",
    destructive: false,
  },
};
