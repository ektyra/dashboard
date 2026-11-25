import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldLabel } from "../components/field";
import { CollapsibleFormSection, FormSection } from "../components/form-section";
import { Input } from "../components/input";

const meta = {
  title: "Inputs & Forms/FormSection",
  component: FormSection,
  parameters: { layout: "padded" },
  args: { title: "Profile", description: "How you appear to your team." },
} satisfies Meta<typeof FormSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const fields = (
  <div className="grid max-w-md gap-4">
    <Field>
      <FieldLabel htmlFor="n">Name</FieldLabel>
      <Input id="n" defaultValue="Ada Lovelace" />
    </Field>
    <Field>
      <FieldLabel htmlFor="r">Role</FieldLabel>
      <Input id="r" defaultValue="Engineer" />
    </Field>
  </div>
);

export const Default: Story = { args: { children: fields } };
export const WithSeparator: Story = { args: { separator: true, children: fields } };

export const Collapsible: Story = {
  args: { title: "Advanced", description: "Rarely needed.", children: fields },
  render: (args) => <CollapsibleFormSection {...args} defaultOpen />,
};
