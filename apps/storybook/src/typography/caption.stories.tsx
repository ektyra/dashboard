import type { Meta, StoryObj } from "@storybook/react-vite";
import { Caption } from "../components/caption";

const meta = {
  title: "Typography/Caption",
  component: Caption,
  args: { children: "Figure 1: Orders per week, last quarter" },
} satisfies Meta<typeof Caption>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UnderAFigure: Story = {
  render: (args) => (
    <figure className="flex w-72 flex-col gap-2">
      <div className="bg-muted h-32 rounded-lg" role="img" aria-label="Placeholder chart" />
      <figcaption>
        <Caption {...args} />
      </figcaption>
    </figure>
  ),
};

export const UnderAField: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-1">
      <input
        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
        defaultValue="ektyra"
        aria-describedby="hint"
      />
      <Caption id="hint">Lowercase letters and numbers only.</Caption>
    </div>
  ),
};
