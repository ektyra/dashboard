/**
 * OKLCH colour maths. OKLCH is how colours are stored in this project (lightness, chroma, hue):
 * it is perceptually even, so changing the lightness keeps the colour recognisable. Hex only
 * appears at the edge, for the browser's colour input.
 */
export type Oklch = { l: number; c: number; h: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
const toSrgb = (value: number) =>
  value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;

/** "#rrggbb" (or "#rgb") to OKLCH. Returns undefined for anything else. */
export function hexToOklch(hex: string): Oklch | undefined {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return undefined;
  const raw = match[1]!.length === 3 ? match[1]!.replace(/./g, (c) => c + c) : match[1]!;
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(raw.slice(i, i + 2), 16) / 255)) as [
    number,
    number,
    number,
  ];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, bb);
  const hue = chroma < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: round(lightness, 4), c: round(chroma, 4), h: round(hue, 1) };
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** OKLCH to "#rrggbb". Colours outside the screen's range are pulled in by lowering the chroma. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const hue = (h * Math.PI) / 180;
  const toRgb = (chroma: number) => {
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);
    const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
      -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
      -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
    ] as const;
  };
  let chroma = Math.max(0, c);
  let rgb = toRgb(chroma);
  for (let i = 0; i < 24 && rgb.some((v) => v < -0.0005 || v > 1.0005); i++) {
    chroma *= 0.92;
    rgb = toRgb(chroma);
  }
  return `#${rgb
    .map((v) =>
      Math.round(clamp(toSrgb(clamp(v, 0, 1)), 0, 1) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** `oklch(0.52 0.24 282)` for use in CSS. */
export const formatOklch = ({ l, c, h }: Oklch) => `oklch(${l} ${c} ${h})`;

/** Keeps a colour inside the ranges the custom palette is designed for. */
export const normalizeOklch = ({ l, c, h }: Oklch): Oklch => ({
  l: round(clamp(l, 0.2, 0.9), 3),
  c: round(clamp(c, 0, 0.4), 3),
  h: round(((h % 360) + 360) % 360, 1),
});

const luminance = (hex: string) => {
  const raw = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(raw.slice(i, i + 2), 16) / 255)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two colours, 1 to 21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const [x, y] = [luminance(oklchToHex(a)), luminance(oklchToHex(b))];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** The WCAG level a ratio reaches for normal text: AAA 7, AA 4.5, AA large 3, otherwise fail. */
export const contrastLevel = (ratio: number) =>
  ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fail";

/** Reads `oklch(0.5 0.2 280)` (percent lightness and `deg` allowed). Alpha and anything else gives undefined. */
export function parseOklch(value: string): Oklch | undefined {
  const match = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/i.exec(value.trim());
  if (!match) return undefined;
  const l = Number(match[1]) / (match[2] ? 100 : 1);
  const [c, h] = [Number(match[3]), Number(match[4])];
  return [l, c, h].every(Number.isFinite) ? { l, c, h } : undefined;
}
