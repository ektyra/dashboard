import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, Plus } from "lucide-react";
import { Button } from "../components/button";
import { Kbd } from "../components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";

const meta = { title: "Overlays/Tooltip", component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover or focus me</Button>
      </TooltipTrigger>
      <TooltipContent>Saves your work</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-6 py-10">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" aria-label="New">
          <Plus />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        New item <Kbd className="border-background/30 bg-background/10 text-background/80">N</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Hint: Story = {
  render: () => (
    <p className="flex items-center gap-1.5 text-sm">
      API key
      <Tooltip>
        <TooltipTrigger aria-label="About API keys" className="text-muted-foreground">
          <Info className="size-4" />
        </TooltipTrigger>
        <TooltipContent>Used to connect other tools. Keep it secret.</TooltipContent>
      </Tooltip>
    </p>
  ),
};
