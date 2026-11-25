import type { Palette } from "../appearance";

/**
 * What each palette looks like in its swatch: the brand color and the page background, in
 * light and dark. These repeat a few values from `core/styles/palettes.css`, only to draw
 * the previews; the palette itself is applied through CSS.
 */
export const paletteOptions: readonly {
  value: Palette;
  label: string;
  light: { primary: string; background: string };
  dark: { primary: string; background: string };
}[] = [
  {
    value: "default",
    label: "Default",
    light: { primary: "oklch(0.5229 0.2403 282.5)", background: "oklch(0.9921 0.0017 325.6)" },
    dark: { primary: "oklch(0.6 0.22 282.5)", background: "oklch(0.16 0.012 285)" },
  },
  {
    value: "claude",
    label: "Claude",
    light: { primary: "oklch(0.6171 0.1375 39.0427)", background: "oklch(0.9818 0.0054 95.0986)" },
    dark: { primary: "oklch(0.6724 0.1308 38.7559)", background: "oklch(0.2679 0.0036 106.6427)" },
  },
  {
    value: "amber",
    label: "Amber",
    light: { primary: "oklch(0.7686 0.1647 70.0804)", background: "oklch(1 0 0)" },
    dark: { primary: "oklch(0.7686 0.1647 70.0804)", background: "oklch(0.2046 0 0)" },
  },
  {
    value: "ocean",
    label: "Ocean breeze",
    light: { primary: "oklch(0.7227 0.192 149.5793)", background: "oklch(0.9751 0.0127 244.2507)" },
    dark: { primary: "oklch(0.7729 0.1535 163.2231)", background: "oklch(0.2077 0.0398 265.7549)" },
  },
  {
    value: "violet",
    label: "Violet bloom",
    light: { primary: "oklch(0.5393 0.2713 286.7462)", background: "oklch(0.994 0 0)" },
    dark: { primary: "oklch(0.6132 0.2294 291.7437)", background: "oklch(0.2223 0.006 271.1393)" },
  },
  {
    value: "nature",
    label: "Nature",
    light: { primary: "oklch(0.5234 0.1347 144.1672)", background: "oklch(0.9711 0.0074 80.7211)" },
    dark: { primary: "oklch(0.6731 0.1624 144.2083)", background: "oklch(0.2683 0.0279 150.7681)" },
  },
  {
    value: "catppuccin",
    label: "Catppuccin",
    light: {
      primary: "oklch(0.5547 0.2503 297.0156)",
      background: "oklch(0.9578 0.0058 264.5321)",
    },
    dark: { primary: "oklch(0.7871 0.1187 304.7693)", background: "oklch(0.2155 0.0254 284.0647)" },
  },
  {
    value: "supabase",
    label: "Supabase",
    light: { primary: "oklch(0.8348 0.1302 160.908)", background: "oklch(0.9911 0 0)" },
    dark: { primary: "oklch(0.4365 0.1044 156.7556)", background: "oklch(0.1822 0 0)" },
  },
  {
    value: "custom",
    label: "Custom",
    // The swatch follows the brand colour the user picks (CSS variables on <html>).
    light: {
      primary: "oklch(var(--brand-l, 0.52) var(--brand-c, 0.24) var(--brand-h, 282))",
      background: "oklch(0.985 calc(var(--brand-c, 0.24) * 0.03) var(--brand-h, 282))",
    },
    dark: {
      primary: "oklch(calc(var(--brand-l, 0.52) + 0.1) var(--brand-c, 0.24) var(--brand-h, 282))",
      background: "oklch(0.16 calc(var(--brand-c, 0.24) * 0.06) var(--brand-h, 282))",
    },
  },
];
