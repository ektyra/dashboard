import type { Meta, StoryObj } from "@storybook/react-vite";
import { useToken } from "./use-token";

const meta = {
  title: "Foundations/Spacing and radius",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

const steps = [1, 2, 3, 4, 6, 8, 12, 16] as const;
const radii = [
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
] as const;

function Radius() {
  const base = useToken("--radius");
  return <span>Base radius: {base || "…"} (all other radii are derived from it)</span>;
}

export const SpacingAndRadius: StoryObj = {
  render: () => (
    <div className="text-foreground flex flex-col gap-10 p-2">
      <section>
        <h3 className="mb-1 text-lg font-semibold">Spacing</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          One step is 4 px. Use these for gaps and padding (<code>gap-4</code>, <code>p-6</code>).
        </p>
        <div className="flex flex-col gap-2">
          {steps.map((n) => (
            <div key={n} className="flex items-center gap-4">
              <code className="text-muted-foreground w-24 shrink-0 text-xs">
                {n} · {n * 4} px
              </code>
              <div
                className="bg-primary h-4 rounded-sm"
                style={{ width: `calc(var(--spacing) * ${n})` }}
              />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-1 text-lg font-semibold">Border radius</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          <Radius />
        </p>
        <div className="flex flex-wrap gap-6">
          {radii.map((cls) => (
            <div key={cls} className="flex flex-col items-center gap-2">
              <div className={`bg-accent border-primary h-20 w-20 border-2 ${cls}`} />
              <code className="text-muted-foreground text-xs">{cls}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
