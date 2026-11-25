import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Button } from "../components/button";
import { sampleConfig } from "../navigation/sample-config";
import { LayoutProvider } from "../shell/config/layout-config";
import { PageHeader } from "../shell/page-header";

const meta = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  parameters: { layout: "padded", initialPath: "/reports" },
  args: { title: "Reports", subtitle: "Everything your team published this quarter." },
  decorators: [
    (Story) => (
      <LayoutProvider config={sampleConfig}>
        <div className="max-w-4xl">
          <Story />
        </div>
      </LayoutProvider>
    ),
  ],
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button>
          <Plus /> New report
        </Button>
      </>
    ),
  },
};

export const NestedMenuPage: Story = {
  parameters: { initialPath: "/people/team" },
  args: { title: "Team", subtitle: "People with access." },
};

export const DetailPage: Story = {
  parameters: { initialPath: "/projects" },
  args: {
    title: "Website redesign",
    subtitle: "Owned by Ada Lovelace.",
    current: "Website redesign",
    leading: (
      <Avatar className="size-12">
        <AvatarFallback>WR</AvatarFallback>
      </Avatar>
    ),
  },
};

export const NoBreadcrumbs: Story = { args: { hideBreadcrumbs: true } };
