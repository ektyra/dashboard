import type { Meta, StoryObj } from "@storybook/react-vite";
import { KanbanPage } from "./kanban";

const meta = {
  title: "Data Display/Kanban board (Pro)",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

/** Drag cards between columns (pointer, or Space and arrow keys), add cards, filter and open a card. */
export const Board: Story = {
  render: () => (
    <div className="p-6">
      <KanbanPage />
    </div>
  ),
};
