import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic } from "lucide-react";
import { Toggle } from "../components/toggle";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";

const meta = { title: "Extras/Toggle and ToggleGroup", component: Toggle } satisfies Meta<
  typeof Toggle
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline" defaultPressed>
        <Italic />
      </Toggle>
      <Toggle aria-label="Disabled" disabled>
        <Bold />
      </Toggle>
    </div>
  ),
};

export const GroupSingle: Story = {
  name: "Group (pick one)",
  render: () => (
    <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
      <ToggleGroupItem value="left" aria-label="Left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const GroupMultiple: Story = {
  name: "Group (pick several)",
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
