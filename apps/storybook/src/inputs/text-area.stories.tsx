import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldDescription, FieldLabel } from "../components/field";
import { FloatingTextarea } from "../components/floating-field";
import { Textarea } from "../components/textarea";

const meta = {
  title: "Inputs & Forms/TextArea",
  component: Textarea,
  args: { placeholder: "Write a note…", rows: 4 },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Textarea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked note" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "Too short" } };

export const WithLabel: Story = {
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="note">Note</FieldLabel>
      <Textarea id="note" {...args} />
      <FieldDescription>Only your team can see this.</FieldDescription>
    </Field>
  ),
};

export const Floating: Story = {
  render: () => <FloatingTextarea id="msg" label="Message" rows={4} />,
};
