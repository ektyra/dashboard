import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwatchGroup } from "./swatch";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

export const Colors: StoryObj = {
  render: () => (
    <div className="p-2">
      <SwatchGroup
        title="Brand"
        description="The indigo brand color and the tints made from it."
        tokens={[
          "--primary",
          "--primary-foreground",
          "--secondary",
          "--secondary-foreground",
          "--accent",
          "--accent-foreground",
        ]}
      />
      <SwatchGroup
        title="Surfaces"
        description="Page, cards, popups and quiet areas."
        tokens={[
          "--background",
          "--foreground",
          "--card",
          "--card-foreground",
          "--popover",
          "--popover-foreground",
          "--muted",
          "--muted-foreground",
        ]}
      />
      <SwatchGroup
        title="Status"
        description="Success, warning, info and danger, plus readable text colors for use on a tint."
        tokens={[
          "--success",
          "--warning",
          "--info",
          "--destructive",
          "--success-text",
          "--warning-text",
          "--info-text",
          "--destructive-text",
        ]}
      />
      <SwatchGroup title="Lines and focus" tokens={["--border", "--input", "--ring"]} />
      <SwatchGroup
        title="Charts"
        description="Use in order: 1, 2, 3... Fold anything past 6 into “Other”."
        tokens={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--chart-${n}`)}
      />
      <SwatchGroup
        title="Sidebar"
        tokens={[
          "--sidebar",
          "--sidebar-foreground",
          "--sidebar-primary",
          "--sidebar-accent",
          "--sidebar-border",
        ]}
      />
    </div>
  ),
};
