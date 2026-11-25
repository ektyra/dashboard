import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "../components/button";
import { notify } from "../toast";

const meta = {
  title: "Feedback/Toast",
  parameters: { layout: "centered" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => notify.message("Link copied")}>
        Message
      </Button>
      <Button
        variant="outline"
        onClick={() => notify.success("Saved", { description: "Your changes are live." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notify.error("Could not save", { description: "Check your connection and try again." })
        }
      >
        Error
      </Button>
      <Button variant="outline" onClick={() => notify.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => notify.info("New version available")}>
        Info
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        notify.message("Order deleted", {
          action: { label: "Undo", onClick: () => notify.success("Restored") },
        })
      }
    >
      Delete order
    </Button>
  ),
};

export const Task: Story = {
  name: "Task (loading, then result)",
  render: () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() =>
          notify.task(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "Exporting…",
            success: "Export ready",
            error: "Export failed",
          })
        }
      >
        Run a task
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Clear all
      </Button>
    </div>
  ),
};
