import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutProvider } from "../shell/config/layout-config";
import { Sidebar } from "../shell/sidebar/sidebar";
import { toggleSidebar, useSidebarCollapsed } from "../shell/sidebar-state";
import { Button } from "../components/button";
import { sampleConfig } from "./sample-config";

function Frame({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebarCollapsed();
  return (
    <LayoutProvider config={sampleConfig}>
      <div className="flex h-[36rem] w-full">
        {children}
        <div className="flex flex-1 flex-col items-start gap-3 p-6">
          <p className="text-muted-foreground text-sm">Page content</p>
          <Button variant="outline" onClick={() => toggleSidebar()}>
            {collapsed ? "Expand" : "Collapse"} sidebar
          </Button>
        </div>
      </div>
    </LayoutProvider>
  );
}

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <Frame>
      <Sidebar {...args} />
    </Frame>
  ),
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithProjects: Story = {
  args: {
    projects: [
      { id: "1", name: "Marketing site" },
      { id: "2", name: "Customer portal" },
    ],
    activeProjectId: "1",
    projectLabel: "Project",
    projectMenuLabel: "Switch project",
  },
};
