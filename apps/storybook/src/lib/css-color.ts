let context: CanvasRenderingContext2D | null | undefined;

/**
 * Turns any CSS color the browser understands (oklch(), color-mix(), a named
 * color) into "rgb(r, g, b)". Chart libraries parse colors themselves and often
 * cannot read oklch or CSS variables, so we hand them plain rgb.
 */
export function toRgb(color: string): string {
  context ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!context) return color;
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = "#000";
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Reads a CSS variable from the page (":root", so it follows light and dark mode) and returns it as rgb. */
export function readToken(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return toRgb(value || "#000");
}

const parse = (rgb: string) =>
  (rgb.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number) as [number, number, number];

/** Mixes two rgb colors. `amount` is how much of `from` (0 to 1). */
export function mixRgb(from: string, to: string, amount: number): string {
  const a = parse(from);
  const b = parse(to);
  const mixed = a.map((channel, index) =>
    Math.round(channel * amount + (b[index] ?? 0) * (1 - amount)),
  );
  return `rgb(${mixed.join(", ")})`;
}

/** The same rgb color with transparency (0 to 1), for fills that must not hide what is behind them. */
export function withAlpha(rgb: string, alpha: number): string {
  const [r, g, b] = parse(rgb);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
