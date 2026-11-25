import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFrame } from "../templates/app-frame";
import { SamplePage } from "../templates/sample-page";

const meta = {
  title: "Layout/App layouts (Pro)",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  name: "Vertical (default, Free)",
  render: () => (
    <AppFrame layout="vertical">
      <SamplePage />
    </AppFrame>
  ),
};

export const HorizontalMenu: Story = {
  name: "Horizontal menu (Pro)",
  render: () => (
    <AppFrame layout="horizontal">
      <SamplePage />
    </AppFrame>
  ),
};

export const DetachedSidebar: Story = {
  name: "Detached sidebar (Pro)",
  render: () => (
    <AppFrame layout="detached">
      <SamplePage />
    </AppFrame>
  ),
};
