import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../components/label";
import { Switch } from "../components/switch";

const meta = { title: "Inputs & Forms/Switch", component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="s1" />
        <Label htmlFor="s1">Off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s2" defaultChecked />
        <Label htmlFor="s2">On</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s3" disabled />
        <Label htmlFor="s3">Disabled</Label>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" aria-label="Small" defaultChecked />
      <Switch size="md" aria-label="Medium" defaultChecked />
      <Switch size="lg" aria-label="Large" defaultChecked />
    </div>
  ),
};
