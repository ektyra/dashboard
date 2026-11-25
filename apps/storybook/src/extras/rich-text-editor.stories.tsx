import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextEditor } from "../components/rich-text-editor";

const meta = {
  title: "Extras/RichTextEditor",
  component: RichTextEditor,
  parameters: { layout: "padded" },
  args: {
    label: "Message",
    content:
      "<h2>Weekly update</h2><p>Revenue is <strong>up 12%</strong>. See the <em>full report</em> for details.</p>",
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};
export const Mail: Story = {
  args: { variant: "mail", content: "<p>Hi Ada,</p><p>Thanks for the report.</p>" },
};
export const Empty: Story = { args: { content: "" } };
