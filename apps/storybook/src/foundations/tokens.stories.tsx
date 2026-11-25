import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwatchGroup } from "./swatch";

const palettes = [
  "default",
  "claude",
  "amber",
  "ocean",
  "violet",
  "nature",
  "catppuccin",
  "supabase",
] as const;

type Args = { palette: (typeof palettes)[number] };

const meta = {
  title: "Foundations/Design tokens",
  parameters: { layout: "padded" },
  args: { palette: "default" },
  argTypes: {
    palette: { control: "select", options: palettes, description: "Sets html[data-palette]" },
  },
  render: ({ palette }) => <Tokens palette={palette} />,
} satisfies Meta<Args>;
export default meta;

function Tokens({ palette }: Readonly<Args>) {
  useEffect(() => {
    const root = document.documentElement;
    if (palette === "default") root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", palette);
    return () => root.removeAttribute("data-palette");
  }, [palette]);

  return (
    <div className="text-foreground flex flex-col gap-8 p-2">
      <section className="max-w-2xl text-sm leading-relaxed">
        <h3 className="mb-2 text-lg font-semibold">How tokens work</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Colors, radius, shadows and fonts are CSS variables (OKLCH) defined once in{" "}
            <code>theme.css</code>.
          </li>
          <li>
            Use them through Tailwind classes (<code>bg-primary</code>,{" "}
            <code>text-muted-foreground</code>
            ), never hard-coded colors.
          </li>
          <li>
            Dark mode: the <code>dark</code> class on <code>&lt;html&gt;</code> swaps every token.
          </li>
          <li>
            A palette (<code>data-palette</code>) changes colors only; radius, fonts and shadows
            stay Ektyra&apos;s own.
          </li>
        </ul>
      </section>
      <SwatchGroup
        title={`Palette: ${palette}`}
        description="Pick another palette in the Controls panel and switch light/dark in the toolbar."
        tokens={[
          "--background",
          "--foreground",
          "--primary",
          "--secondary",
          "--accent",
          "--muted",
          "--card",
          "--border",
          "--destructive",
          "--chart-1",
          "--chart-2",
          "--chart-3",
        ]}
      />
    </div>
  );
}

export const Palettes: StoryObj<Args> = {};
