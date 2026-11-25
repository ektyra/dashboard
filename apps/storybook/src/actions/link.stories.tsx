import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "../components/link";

const meta = {
  title: "Actions/Link",
  component: Link,
  args: { href: "#", children: "Read the docs" },
  argTypes: {
    variant: { control: "inline-radio", options: ["inline", "standalone", "muted"] },
    external: { control: "boolean" },
  },
} satisfies Meta<typeof Link>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: (args) => (
    <p className="max-w-sm text-sm leading-relaxed">
      Every dashboard starts from the template. <Link {...args} /> before you change anything.
    </p>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3 text-sm">
      <Link {...args} variant="inline">
        Inline
      </Link>
      <Link {...args} variant="standalone">
        Standalone
      </Link>
      <Link {...args} variant="muted">
        Muted
      </Link>
    </div>
  ),
};

export const External: Story = {
  args: { external: true, href: "https://ektyra.com", children: "ektyra.com" },
};
