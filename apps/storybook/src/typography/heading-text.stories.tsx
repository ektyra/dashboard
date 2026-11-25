import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "../components/heading";
import { Text } from "../components/text";

const meta = {
  title: "Typography/Heading and Text",
  component: Heading,
  args: { children: "Reports that explain themselves", level: 2 },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    size: { control: "select", options: ["4xl", "3xl", "2xl", "xl", "lg", "base"] },
  },
} satisfies Meta<typeof Heading>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const LevelAndSizeAreSeparate: Story = {
  name: "Level and size are separate",
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={2} size="base">
        An h2 that looks small
      </Heading>
      <Heading level={4} size="4xl">
        An h4 that looks big
      </Heading>
    </div>
  ),
};

export const TextVariants: Story = {
  name: "Text variants",
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Text variant="lead">
        Lead: one calm sentence that tells the reader what the page is for.
      </Text>
      <Text>
        Body: the default paragraph. Short, active sentences. Say what happened and what to do next.
      </Text>
      <Text variant="small">Small: supporting text that is still important.</Text>
      <Text variant="muted">Muted: hints and descriptions that can be skipped.</Text>
    </div>
  ),
};

export const Article: Story = {
  render: () => (
    <article className="flex max-w-xl flex-col gap-3">
      <Heading level={1}>Welcome back</Heading>
      <Text variant="lead">Here is what changed since your last visit.</Text>
      <Heading level={2} size="xl">
        New orders
      </Heading>
      <Text>Twelve orders arrived overnight. Three need your attention.</Text>
    </article>
  ),
};
