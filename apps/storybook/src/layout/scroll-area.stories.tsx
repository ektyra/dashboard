import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "../components/scroll-area";

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="border-border h-64 w-72 rounded-lg border">
      <ul className="divide-border divide-y text-sm">
        {Array.from({ length: 30 }, (_, i) => (
          <li key={i} className="px-4 py-2.5">
            Item {i + 1}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="border-border w-80 rounded-lg border">
      <div className="flex gap-3 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="bg-accent grid size-24 shrink-0 place-items-center rounded-md text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
