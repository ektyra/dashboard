import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Label } from "../components/label";
import { Slider } from "../components/slider";

const meta = {
  title: "Inputs & Forms/Slider",
  component: Slider,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { defaultValue: [40], max: 100, step: 1, "aria-label": "Volume" },
};
export const Range: Story = {
  args: { defaultValue: [20, 70], max: 100, "aria-label": "Price range" },
};
export const Disabled: Story = {
  args: { defaultValue: [30], disabled: true, "aria-label": "Disabled" },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <Label>Opacity</Label>
          <span className="text-muted-foreground tabular-nums">{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} aria-label="Opacity" />
      </div>
    );
  },
};
