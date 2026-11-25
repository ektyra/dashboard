import type { Meta, StoryObj } from "@storybook/react-vite";
import { SamplePageContent } from "./sample-content";
import { ThemeCustomizer } from "../shell/customizer/theme-customizer";

const meta = {
  title: "Foundations/Live theme customizer (Pro)",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

/** Open the round button at the bottom right: layout, color scheme, palette, brand colors and radius change this page live. */
export const Customizer: Story = {
  render: () => (
    <div className="bg-background text-foreground min-h-dvh p-8">
      <SamplePageContent />
      <ThemeCustomizer />
    </div>
  ),
};
