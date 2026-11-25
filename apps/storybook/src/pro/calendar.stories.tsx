import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarPage } from "./calendar";

const meta = {
  title: "Data Display/Calendar and scheduler (Pro)",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

/** Day, week and month views with a time grid. Click a slot to add an event, click an event to edit it. */
export const Calendar: Story = {
  render: () => (
    <div className="p-6">
      <CalendarPage />
    </div>
  ),
};
