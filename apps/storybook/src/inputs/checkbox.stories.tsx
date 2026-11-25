import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/checkbox";
import { Label } from "../components/label";

const meta = { title: "Inputs & Forms/Checkbox", component: Checkbox } satisfies Meta<
  typeof Checkbox
>;
export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ id, children }: { id: string; children: string }) => (
  <div className="flex items-center gap-2">
    <Checkbox id={id} />
    <Label htmlFor={id}>{children}</Label>
  </div>
);

export const Default: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-3">
      <Row id="c1">Email me product news</Row>
      <div className="flex items-center gap-2">
        <Checkbox id="c2" defaultChecked />
        <Label htmlFor="c2">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c3" checked="indeterminate" />
        <Label htmlFor="c3">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c4" disabled />
        <Label htmlFor="c4">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c5" aria-invalid />
        <Label htmlFor="c5">Invalid</Label>
      </div>
    </div>
  ),
};
