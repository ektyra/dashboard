import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import { Section } from "../components/section";

const meta = {
  title: "Layout/Section",
  component: Section,
  parameters: { layout: "padded" },
  args: { title: "Team members", description: "People who can open this dashboard." },
} satisfies Meta<typeof Section>;
export default meta;

type Story = StoryObj<typeof meta>;

const body = (
  <div className="bg-card text-muted-foreground rounded-lg border p-6 text-sm">Section content</div>
);

export const Default: Story = { args: { children: body } };

export const WithActions: Story = {
  args: {
    children: body,
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button>Invite</Button>
      </>
    ),
  },
};

export const NoDescription: Story = { args: { description: undefined, children: body } };

export const Nested: Story = {
  render: (args) => (
    <Section {...args} title="Settings" description="Everything about this workspace.">
      <Section title="Profile" level={3} description="Name and photo.">
        {body}
      </Section>
      <Section title="Danger zone" level={3}>
        {body}
      </Section>
    </Section>
  ),
};
