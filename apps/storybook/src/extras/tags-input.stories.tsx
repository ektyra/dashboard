import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TagsInput } from "../components/tags-input";

const meta = {
  title: "Extras/TagsInput",
  component: TagsInput,
  args: { value: [], onChange: () => {}, "aria-label": "Tags" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof TagsInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { placeholder: "Add a tag and press Enter" } };
export const WithValues: Story = { args: { value: ["design", "frontend"] } };
export const WithSuggestions: Story = {
  args: {
    value: ["react"],
    suggestions: ["react", "typescript", "tailwind", "storybook", "vite"],
    placeholder: "Type to see suggestions",
  },
};
