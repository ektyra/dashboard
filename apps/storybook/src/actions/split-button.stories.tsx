import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DropdownMenuItem } from "../components/dropdown-menu";
import { SplitButton } from "../components/split-button";

const menu = (
  <>
    <DropdownMenuItem>Save as draft</DropdownMenuItem>
    <DropdownMenuItem>Save and publish</DropdownMenuItem>
    <DropdownMenuItem>Save as template</DropdownMenuItem>
  </>
);

const meta = {
  title: "Actions/SplitButton",
  component: SplitButton,
  args: { children: "Save", onClick: fn(), menu },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline", "destructive"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof SplitButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Disabled: Story = { args: { disabled: true } };
