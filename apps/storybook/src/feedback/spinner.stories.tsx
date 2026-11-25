import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import { Spinner } from "../components/spinner";

const meta = { title: "Feedback/Spinner", component: Spinner } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-12 text-primary" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button loading>Saving</Button>
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Spinner /> Loading your reports…
      </p>
    </div>
  ),
};
