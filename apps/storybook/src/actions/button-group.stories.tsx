import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Underline } from "lucide-react";
import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";

const meta = {
  title: "Actions/ButtonGroup",
  component: ButtonGroup,
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
} satisfies Meta<typeof ButtonGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="View">
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args} aria-label="Zoom">
      <Button variant="outline">Zoom in</Button>
      <Button variant="outline">Reset</Button>
      <Button variant="outline">Zoom out</Button>
    </ButtonGroup>
  ),
};

export const IconsOnly: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Text style">
      <Button variant="outline" size="icon" aria-label="Bold">
        <Bold />
      </Button>
      <Button variant="outline" size="icon" aria-label="Italic">
        <Italic />
      </Button>
      <Button variant="outline" size="icon" aria-label="Underline">
        <Underline />
      </Button>
    </ButtonGroup>
  ),
};

export const Filled: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonGroup>
  ),
};
