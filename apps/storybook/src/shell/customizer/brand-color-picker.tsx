import { useId } from "react";
import { Pipette } from "lucide-react";
import { hexToOklch, normalizeOklch, oklchToHex } from "../../lib/oklch";
import type { Brand } from "../appearance";

type BrandColorPickerProps = Readonly<{
  value: Brand;
  onChange: (brand: Brand) => void;
  /** Called to go back to the project's own colour. Leave out to hide the button. */
  onReset?: () => void;
}>;

const rows = [
  { key: "l", label: "Lightness", min: 0.2, max: 0.9, step: 0.005 },
  { key: "c", label: "Chroma", min: 0, max: 0.4, step: 0.005 },
  { key: "h", label: "Hue", min: 0, max: 360, step: 1 },
] as const;

/**
 * Picks the brand colour. A colour wheel for speed, and three OKLCH sliders for control: the
 * colour is stored as OKLCH (lightness, chroma, hue), never as hex.
 */
export function BrandColorPicker({ value, onChange, onReset }: BrandColorPickerProps) {
  const id = useId();
  const hex = oklchToHex(value);
  return (
    <div className="grid gap-3 rounded-lg border border-border p-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor={`${id}-wheel`}
          className="relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full ring-1 ring-foreground/15"
          style={{ background: hex }}
        >
          <Pipette className="size-4 text-white mix-blend-difference" aria-hidden="true" />
          <span className="sr-only">Pick a colour</span>
          <input
            id={`${id}-wheel`}
            type="color"
            value={hex}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(event) => {
              const picked = hexToOklch(event.target.value);
              if (picked) onChange(normalizeOklch(picked));
            }}
          />
        </label>
        <div className="grid text-sm">
          <span className="font-mono text-xs">
            oklch({value.l} {value.c} {value.h})
          </span>
          <span className="text-xs text-muted-foreground">{hex}</span>
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto cursor-pointer text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      {rows.map((row) => (
        <label
          key={row.key}
          className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 text-xs"
        >
          <span className="text-muted-foreground">{row.label}</span>
          <input
            type="range"
            min={row.min}
            max={row.max}
            step={row.step}
            value={value[row.key]}
            aria-label={row.label}
            className="accent-primary"
            onChange={(event) =>
              onChange(normalizeOklch({ ...value, [row.key]: Number(event.target.value) }))
            }
          />
          <span className="text-right font-mono tabular-nums">{value[row.key]}</span>
        </label>
      ))}
    </div>
  );
}
