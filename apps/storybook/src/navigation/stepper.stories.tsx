import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../components/button";
import { Stepper } from "../components/stepper";

const steps = [
  { title: "Account", description: "Your details" },
  { title: "Workspace", description: "Name and logo" },
  { title: "Invite", description: "Add your team" },
  { title: "Done" },
];

const meta = {
  title: "Navigation/Stepper",
  component: Stepper,
  args: { steps, current: 1 },
  argTypes: {
    current: { control: { type: "range", min: 0, max: 3 } },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  decorators: [
    (S) => (
      <div className="w-[34rem]">
        <S />
      </div>
    ),
  ],
};
export const Vertical: Story = { args: { orientation: "vertical" } };

export const Interactive: Story = {
  decorators: [
    (S) => (
      <div className="w-[34rem]">
        <S />
      </div>
    ),
  ],
  render: (args) => {
    const [current, setCurrent] = useState(0);
    return (
      <div className="flex flex-col gap-6">
        <Stepper {...args} current={current} onStepClick={setCurrent} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Back
          </Button>
          <Button disabled={current === steps.length - 1} onClick={() => setCurrent((c) => c + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  },
};
