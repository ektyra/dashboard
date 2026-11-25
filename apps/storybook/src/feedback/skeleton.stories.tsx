import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../components/skeleton";

const meta = { title: "Feedback/Skeleton", component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { className: "h-4 w-48" } };

export const CardPlaceholder: Story = {
  render: () => (
    <div
      className="border-border bg-card flex w-80 items-center gap-4 rounded-xl border p-4"
      aria-busy="true"
    >
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
};

export const TablePlaceholder: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3" aria-busy="true">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  ),
};
