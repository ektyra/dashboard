import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

const meta = { title: "Navigation/Tabs", component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground p-4 text-sm">
        A summary of everything that matters.
      </TabsContent>
      <TabsContent value="activity" className="text-muted-foreground p-4 text-sm">
        What changed recently.
      </TabsContent>
      <TabsContent value="settings" className="text-muted-foreground p-4 text-sm">
        Preferences for this project.
      </TabsContent>
    </Tabs>
  ),
};
