import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";
import { fn } from "storybook/test";
import { Button } from "../components/button";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <Download /> Download
      </Button>
      <Button {...args} variant="outline">
        Continue <ArrowRight />
      </Button>
      <Button {...args} variant="destructive">
        <Trash2 /> Delete
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Normal</Button>
      <Button {...args} loading>
        Saving
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} variant="outline" loading>
        Loading
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://ektyra.com">I am a link that looks like a button</a>
    </Button>
  ),
};
