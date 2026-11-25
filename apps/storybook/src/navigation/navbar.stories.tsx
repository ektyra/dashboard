import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "../shell/navbar/navbar";
import { LayoutProvider } from "../shell/config/layout-config";
import { sampleConfig } from "./sample-config";

const user = { name: "Ada Lovelace", email: "ada@example.com" };

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  args: { user, onSignOut: () => {} },
  decorators: [
    (Story) => (
      <LayoutProvider config={sampleConfig}>
        <Story />
      </LayoutProvider>
    ),
  ],
} satisfies Meta<typeof Navbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoNotifications: Story = {
  decorators: [
    (Story) => (
      <LayoutProvider
        config={{
          ...sampleConfig,
          useNotifications: () => ({ items: [], unread: 0, open: () => {}, markAllRead: () => {} }),
        }}
      >
        <Story />
      </LayoutProvider>
    ),
  ],
};
