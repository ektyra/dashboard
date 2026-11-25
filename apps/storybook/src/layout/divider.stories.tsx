import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/separator";

const meta = {
  title: "Layout/Divider",
  component: Separator,
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-72 text-sm">
      <p className="font-medium">Account</p>
      <p className="text-muted-foreground">Manage your profile</p>
      <Separator {...args} className="my-4" />
      <p className="font-medium">Billing</p>
      <p className="text-muted-foreground">Invoices and plan</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator {...args} />
      <span>Source</span>
      <Separator {...args} />
      <span>Support</span>
    </div>
  ),
};
