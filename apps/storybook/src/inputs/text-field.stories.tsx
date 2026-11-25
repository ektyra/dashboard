import type { Meta, StoryObj } from "@storybook/react-vite";
import { AtSign, Search } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel, FormRow } from "../components/field";
import { FloatingInput } from "../components/floating-field";
import { Input } from "../components/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
  InputGroupText,
} from "../components/input-group";
import { PasswordInput } from "../components/password-input";

const meta = {
  title: "Inputs & Forms/TextField",
  component: Input,
  args: { placeholder: "Type something…" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, value: "Locked" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } };

export const WithLabelAndHint: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>We only use this to send receipts.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="email2">Email</FieldLabel>
      <Input id="email2" type="email" aria-invalid defaultValue="not-an-email" />
      <FieldError errors={["Enter an email address like name@example.com."]} />
    </Field>
  ),
};

export const HorizontalRow: Story = {
  decorators: [
    (Story) => (
      <div className="@container w-[36rem]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FormRow
      label="Company"
      htmlFor="company"
      orientation="horizontal"
      description="Shown on invoices."
      required
    >
      <Input id="company" defaultValue="Ektyra BV" />
    </FormRow>
  ),
};

export const InputGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupIcon>
          <Search />
        </InputGroupIcon>
        <InputGroupInput placeholder="Search…" aria-label="Search" />
      </InputGroup>
      <InputGroup>
        <InputGroupText>https://</InputGroupText>
        <InputGroupInput placeholder="your-site" aria-label="Subdomain" />
        <InputGroupText>.ektyra.com</InputGroupText>
      </InputGroup>
      <InputGroup>
        <InputGroupIcon>
          <AtSign />
        </InputGroupIcon>
        <InputGroupInput placeholder="username" aria-label="Username" />
        <InputGroupButton>Check</InputGroupButton>
      </InputGroup>
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="pw">Password</FieldLabel>
      <PasswordInput id="pw" defaultValue="hunter2hunter2" />
    </Field>
  ),
};

export const Floating: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FloatingInput id="f1" label="Full name" />
      <FloatingInput id="f2" label="Search" icon={<Search className="size-4" />} />
      <FloatingInput id="f3" label="Disabled" disabled />
    </div>
  ),
};
