import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Shadows",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

const levels = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
] as const;

export const Shadows: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      {levels.map((cls) => (
        <div key={cls} className="flex flex-col items-center gap-3">
          <div className={`bg-card h-24 w-32 rounded-lg ${cls}`} />
          <code className="text-muted-foreground text-xs">{cls}</code>
        </div>
      ))}
    </div>
  ),
};
