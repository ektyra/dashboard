import { contrastRatio, parseOklch } from "../../lib/oklch";
import type { Oklch } from "../../lib/oklch";

/** A colour in OKLCH: lightness 0 to 1, chroma about 0 to 0.4, hue in degrees. */
export type Brand = Oklch;

export const statusNames = ["destructive", "success", "warning", "info"] as const;
export type StatusName = (typeof statusNames)[number];

/**
 * A full theme for the "custom" palette. Everything is OKLCH. Only `brand` is required: the rest
 * has a good default derived from it, so a theme can be one colour or a hundred decisions.
 */
export type Theme = {
  /** The primary colour. Links, buttons and focus rings. */
  brand: Brand;
  /** Hue (degrees) of secondary surfaces. Default: the brand hue. */
  secondaryHue?: number;
  /** Hue (degrees) of accents (hover backgrounds, highlights). Default: the brand hue. */
  accentHue?: number;
  /** How much colour the surfaces (background, cards, sidebar) carry. 0 is grey, 1 is the default, 2 is bold. */
  tint?: number;
  /** Corner roundness in rem. Default 0.5. */
  radius?: number;
  /** Replacements for the status colours. */
  status?: Partial<Record<StatusName, Brand>>;
  /** Advanced: replace any colour token, for light and dark. Values are oklch(), hex, rgb() or hsl(). */
  tokens?: Record<string, { light?: string; dark?: string }>;
};

export const builtInBrand: Brand = { l: 0.52, c: 0.24, h: 282 };
export const builtInTheme: Theme = { brand: builtInBrand };

/** The colour tokens that can be replaced one by one. */
export const themeTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "warning",
  "info",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

const isToken = (name: string) => (themeTokens as readonly string[]).includes(name);

const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const validColour = (value: unknown): value is Oklch =>
  typeof value === "object" &&
  value !== null &&
  finite((value as Oklch).l) &&
  finite((value as Oklch).c) &&
  finite((value as Oklch).h);

/**
 * A colour value that is safe to put in a stylesheet: oklch(), hex, rgb(), rgba(), hsl() or hsla()
 * with plain numbers. Anything else (url(), var(), braces, semicolons) is refused, because a theme
 * can come from a pasted file or from browser storage.
 */
export const isSafeColour = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 80 &&
  (/^#[0-9a-f]{3,8}$/i.test(value.trim()) ||
    /^(oklch|rgb|rgba|hsl|hsla)\(\s*[0-9a-z.%/,\s-]+\)$/i.test(value.trim()));

/** Keeps what is valid in a theme and drops the rest. Returns undefined when there is no usable brand. */
export function sanitizeTheme(input: unknown): Theme | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const raw = input as Record<string, unknown>;
  if (!validColour(raw.brand)) return undefined;
  const { l, c, h } = raw.brand;
  const theme: Theme = { brand: { l, c, h } };
  if (finite(raw.secondaryHue)) theme.secondaryHue = raw.secondaryHue;
  if (finite(raw.accentHue)) theme.accentHue = raw.accentHue;
  if (finite(raw.tint)) theme.tint = Math.min(2, Math.max(0, raw.tint));
  if (finite(raw.radius)) theme.radius = Math.min(1.5, Math.max(0, raw.radius));
  if (typeof raw.status === "object" && raw.status !== null) {
    const status: Theme["status"] = {};
    for (const name of statusNames) {
      const value = (raw.status as Record<string, unknown>)[name];
      if (validColour(value)) status[name] = { l: value.l, c: value.c, h: value.h };
    }
    if (Object.keys(status).length > 0) theme.status = status;
  }
  if (typeof raw.tokens === "object" && raw.tokens !== null) {
    const tokens: NonNullable<Theme["tokens"]> = {};
    for (const [name, value] of Object.entries(raw.tokens)) {
      if (!isToken(name) || typeof value !== "object" || value === null) continue;
      const { light, dark } = value as { light?: unknown; dark?: unknown };
      const entry = {
        ...(isSafeColour(light) ? { light: light.trim() } : {}),
        ...(isSafeColour(dark) ? { dark: dark.trim() } : {}),
      };
      if (entry.light || entry.dark) tokens[name] = entry;
    }
    if (Object.keys(tokens).length > 0) theme.tokens = tokens;
  }
  return theme;
}

const n = (value: number) => String(Math.round(value * 1000) / 1000);
const colourText = (colour: Oklch) => `oklch(${n(colour.l)} ${n(colour.c)} ${n(colour.h)})`;

/**
 * The stylesheet for a theme. It only applies while `data-palette="custom"` is set, and it is more
 * specific than the palette's own rules, so it wins wherever it is placed in the page.
 */
export function themeCss(theme: Theme): string {
  const { brand } = theme;
  const light: string[] = [
    `--brand-l:${n(brand.l)}`,
    `--brand-c:${n(brand.c)}`,
    `--brand-h:${n(brand.h)}`,
  ];
  const dark: string[] = [];
  if (theme.secondaryHue !== undefined) light.push(`--secondary-h:${n(theme.secondaryHue)}`);
  if (theme.accentHue !== undefined) light.push(`--accent-h:${n(theme.accentHue)}`);
  if (theme.tint !== undefined) light.push(`--tint:${n(theme.tint)}`);
  if (theme.radius !== undefined) light.push(`--radius:${n(theme.radius)}rem`);
  for (const name of statusNames) {
    const colour = theme.status?.[name];
    if (!colour) continue;
    light.push(`--${name}:${colourText(colour)}`);
    // Dark mode lifts the status colour a little so it keeps its contrast on dark surfaces.
    dark.push(`--${name}:${colourText({ ...colour, l: Math.min(0.9, colour.l + 0.08) })}`);
  }
  for (const [name, value] of Object.entries(theme.tokens ?? {})) {
    if (!isToken(name)) continue;
    if (value.light) light.push(`--${name}:${value.light}`);
    if (value.dark) dark.push(`--${name}:${value.dark}`);
  }
  const rule = (selector: string, lines: string[]) =>
    lines.length > 0 ? `${selector}{${lines.join(";")}}` : "";
  return [
    rule('html[data-palette="custom"]:root', light),
    rule('html[data-palette="custom"].dark:root', dark),
  ].join("");
}

/** The text colour the custom palette puts on the brand colour (the CSS flips at lightness 0.62). */
export const onBrand = (brand: Brand): Oklch => ({ l: brand.l < 0.62 ? 0.99 : 0.12, c: 0, h: 0 });

export type ContrastCheck = { label: string; ratio: number; need: number };

/** Checks the pairs that decide whether the theme is readable. Light mode. */
export function themeContrast(theme: Theme): ContrastCheck[] {
  const white: Oklch = { l: 1, c: 0, h: 0 };
  const page: Oklch = { l: 0.985, c: 0, h: 0 };
  const checks: ContrastCheck[] = [
    {
      label: "Text on the primary colour",
      ratio: contrastRatio(theme.brand, onBrand(theme.brand)),
      need: 4.5,
    },
    {
      label: "Primary colour on the page (links)",
      ratio: contrastRatio(theme.brand, page),
      need: 4.5,
    },
  ];
  const defaults: Record<StatusName, Oklch> = {
    destructive: { l: 0.577, c: 0.245, h: 27 },
    success: { l: 0.6, c: 0.16, h: 155 },
    warning: { l: 0.72, c: 0.16, h: 70 },
    info: { l: 0.58, c: 0.17, h: 245 },
  };
  for (const name of statusNames) {
    checks.push({
      label: `White text on ${name}`,
      ratio: contrastRatio(theme.status?.[name] ?? defaults[name], white),
      need: 4.5,
    });
  }
  return checks;
}

const hslBare = /^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/;

/**
 * Reads a shadcn or tweakcn theme (the `:root { … }` and `.dark { … }` blocks of a CSS file) into a
 * theme. Unknown variables are skipped, and the result says how many colours were taken over.
 * Without a usable `--primary` the brand stays what it was.
 */
export function importThemeCss(css: string, base: Theme): { theme: Theme; imported: number } {
  const tokens: NonNullable<Theme["tokens"]> = { ...base.tokens };
  let radius = base.radius;
  let brand = base.brand;
  let imported = 0;
  for (const block of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = block[1]!.trim();
    const mode = /(^|[\s,])\.dark\b/.test(selector)
      ? "dark"
      : /:root|^html$|^\*$/.test(selector)
        ? "light"
        : undefined;
    if (!mode) continue;
    for (const line of block[2]!.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);?/gi)) {
      const name = line[1]!;
      let value = line[2]!.trim();
      if (name === "radius") {
        const rem = /^([\d.]+)rem$/.exec(value);
        if (rem && mode === "light") radius = Math.min(1.5, Number(rem[1]));
        continue;
      }
      if (!isToken(name)) continue;
      if (hslBare.test(value)) value = `hsl(${value})`;
      if (!isSafeColour(value)) continue;
      tokens[name] = { ...tokens[name], [mode]: value };
      imported++;
      if (name === "primary" && mode === "light") {
        const parsed = parseOklch(value);
        if (parsed) brand = parsed;
      }
    }
  }
  return { theme: { ...base, brand, radius, tokens }, imported };
}
