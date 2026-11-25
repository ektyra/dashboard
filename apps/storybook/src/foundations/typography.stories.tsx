import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Typography scale",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

const sizes = [
  ["text-xs", "12 px"],
  ["text-sm", "14 px"],
  ["text-base", "16 px"],
  ["text-lg", "18 px"],
  ["text-xl", "20 px"],
  ["text-2xl", "24 px"],
  ["text-3xl", "30 px"],
  ["text-4xl", "36 px"],
] as const;

const weights = [
  ["font-normal", "400"],
  ["font-medium", "500"],
  ["font-semibold", "600"],
  ["font-bold", "700"],
] as const;

export const Scale: StoryObj = {
  render: () => (
    <div className="text-foreground flex flex-col gap-10 p-2">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Font families</h3>
        <div className="flex flex-col gap-2">
          <p className="font-sans text-2xl">
            Sans: Manrope. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-serif text-2xl">Serif: system serif. The quick brown fox jumps.</p>
          <p className="font-mono text-2xl">Mono: system mono. 0123456789 {"{ }"} =&gt;</p>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-semibold">Size scale</h3>
        <div className="flex flex-col gap-3">
          {sizes.map(([cls, px]) => (
            <div key={cls} className="border-border flex items-baseline gap-6 border-b pb-3">
              <code className="text-muted-foreground w-28 shrink-0 text-xs">
                {cls} · {px}
              </code>
              <span className={cls}>Design systems keep teams consistent</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-semibold">Weights</h3>
        <div className="flex flex-col gap-2">
          {weights.map(([cls, w]) => (
            <div key={cls} className="flex items-baseline gap-6">
              <code className="text-muted-foreground w-28 shrink-0 text-xs">
                {cls} · {w}
              </code>
              <span className={`${cls} text-xl`}>Ektyra dashboard</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
