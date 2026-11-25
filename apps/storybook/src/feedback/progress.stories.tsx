import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Progress } from "../components/progress";

const meta = {
  title: "Feedback/ProgressBar",
  component: Progress,
  args: { value: 60, "aria-label": "Upload progress" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Complete: Story = { args: { value: 100 } };
export const Indeterminate: Story = { args: { value: undefined, "aria-label": "Loading" } };

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 300);
      return () => clearInterval(t);
    }, []);
    return (
      <div className="flex flex-col gap-2">
        <Progress value={value} aria-label="Uploading" />
        <span className="text-muted-foreground text-xs tabular-nums">{value}%</span>
      </div>
    );
  },
};
