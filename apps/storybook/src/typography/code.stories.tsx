import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "../components/code-block";
import { Kbd } from "../components/kbd";

const meta = {
  title: "Typography/Code",
  component: CodeBlock,
  parameters: { layout: "padded" },
  args: {
    filename: "schema.ts",
    language: "typescript",
    code: `export const users = sqliteTable("users", {\n  id: integer("id").primaryKey(),\n  email: text("email").notNull().unique(),\n});`,
  },
  argTypes: {
    language: { control: "select", options: ["typescript", "tsx", "json", "bash", "css", "html"] },
  },
} satisfies Meta<typeof CodeBlock>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Block: Story = {};

export const Bash: Story = {
  args: {
    language: "bash",
    filename: "terminal",
    code: "vp install\nvp run @ektyra/storybook#dev",
  },
};

export const Json: Story = {
  args: {
    language: "json",
    filename: "package.json",
    code: `{\n  "name": "ektyra",\n  "private": true\n}`,
  },
};

export const InlineCodeAndKeys: Story = {
  name: "Inline code and keys",
  render: () => (
    <p className="text-foreground max-w-md text-sm leading-7">
      Run <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">vp check</code>{" "}
      before you commit. Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open search, or <Kbd>Esc</Kbd> to close
      it.
    </p>
  ),
};
