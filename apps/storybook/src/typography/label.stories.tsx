import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../components/label";

const meta = {
  title: "Typography/Label",
  component: Label,
  args: { children: "Email address", htmlFor: "email" },
} satisfies Meta<typeof Label>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args} />
      <input
        id="email"
        className="border-input bg-background h-9 w-64 rounded-md border px-3 text-sm"
        placeholder="you@example.com"
      />
    </div>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <div className="group flex flex-col gap-2">
      <input
        id="name"
        disabled
        className="peer border-input bg-background order-2 h-9 w-64 rounded-md border px-3 text-sm disabled:opacity-50"
        placeholder="Locked"
      />
      <Label htmlFor="name" className="order-1">
        Name (dims when the field is disabled)
      </Label>
    </div>
  ),
};
