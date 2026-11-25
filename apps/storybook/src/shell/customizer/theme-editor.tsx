import { useId, useState } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import { Button } from "../../components/button";
import { Textarea } from "../../components/textarea";
import { contrastLevel, hexToOklch, normalizeOklch, oklchToHex } from "../../lib/oklch";
import {
  importThemeCss,
  isSafeColour,
  statusNames,
  themeContrast,
  themeTokens,
} from "../appearance";
import type { StatusName, Theme } from "../appearance";
import { BrandColorPicker } from "./brand-color-picker";

type ThemeEditorProps = Readonly<{
  theme: Theme;
  onChange: (theme: Theme) => void;
  onReset?: () => void;
}>;

const statusDefaults: Record<StatusName, { l: number; c: number; h: number }> = {
  destructive: { l: 0.577, c: 0.245, h: 27 },
  success: { l: 0.6, c: 0.16, h: 155 },
  warning: { l: 0.72, c: 0.16, h: 70 },
  info: { l: 0.58, c: 0.17, h: 245 },
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  onClear,
}: Readonly<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  onClear?: () => void;
}>) {
  return (
    <label className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        className="accent-primary"
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="flex items-center justify-end gap-1 font-mono">
        {display}
        {onClear && (
          <button
            type="button"
            aria-label={`Reset ${label}`}
            onClick={(event) => {
              event.preventDefault();
              onClear();
            }}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        )}
      </span>
    </label>
  );
}

function Heading({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-xs font-medium text-muted-foreground uppercase">{children}</p>;
}

/**
 * Edits a full theme for the custom palette: the brand colour, the hues of secondary surfaces and
 * accents, how much colour the surfaces carry, the corner radius, the status colours, a contrast
 * check, an import for shadcn or tweakcn themes and, for people who want it, any single token.
 * Everything is stored as OKLCH.
 */
export function ThemeEditor({ theme, onChange, onReset }: ThemeEditorProps) {
  const id = useId();
  const [pasted, setPasted] = useState("");
  const [message, setMessage] = useState("");
  const [tokenName, setTokenName] = useState<string>(themeTokens[0]);
  const [tokenLight, setTokenLight] = useState("");
  const [tokenDark, setTokenDark] = useState("");
  const set = (patch: Partial<Theme>) => onChange({ ...theme, ...patch });
  const checks = themeContrast(theme);
  const overrides = Object.entries(theme.tokens ?? {});

  const addToken = () => {
    const light = isSafeColour(tokenLight) ? tokenLight.trim() : undefined;
    const dark = isSafeColour(tokenDark) ? tokenDark.trim() : undefined;
    if (!light && !dark) {
      setMessage("Use oklch(), a hex colour, rgb() or hsl().");
      return;
    }
    setMessage("");
    set({
      tokens: { ...theme.tokens, [tokenName]: { ...theme.tokens?.[tokenName], light, dark } },
    });
    setTokenLight("");
    setTokenDark("");
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Heading>Primary colour</Heading>
        <BrandColorPicker
          value={theme.brand}
          onChange={(brand) => set({ brand })}
          onReset={onReset}
        />
      </div>

      <div className="grid gap-3">
        <Heading>Shape and surfaces</Heading>
        <Slider
          label="Secondary hue"
          value={theme.secondaryHue ?? theme.brand.h}
          min={0}
          max={360}
          step={1}
          display={theme.secondaryHue === undefined ? "brand" : String(theme.secondaryHue)}
          onChange={(secondaryHue) => set({ secondaryHue })}
          onClear={
            theme.secondaryHue === undefined ? undefined : () => set({ secondaryHue: undefined })
          }
        />
        <Slider
          label="Accent hue"
          value={theme.accentHue ?? theme.brand.h}
          min={0}
          max={360}
          step={1}
          display={theme.accentHue === undefined ? "brand" : String(theme.accentHue)}
          onChange={(accentHue) => set({ accentHue })}
          onClear={theme.accentHue === undefined ? undefined : () => set({ accentHue: undefined })}
        />
        <Slider
          label="Surface tint"
          value={theme.tint ?? 1}
          min={0}
          max={2}
          step={0.05}
          display={`${Math.round((theme.tint ?? 1) * 100)}%`}
          onChange={(tint) => set({ tint })}
        />
        <Slider
          label="Corner radius"
          value={theme.radius ?? 0.5}
          min={0}
          max={1.25}
          step={0.05}
          display={`${theme.radius ?? 0.5}rem`}
          onChange={(radius) => set({ radius })}
        />
      </div>

      <div className="grid gap-2">
        <Heading>Status colours</Heading>
        <div className="grid grid-cols-2 gap-2">
          {statusNames.map((name) => {
            const colour = theme.status?.[name] ?? statusDefaults[name];
            const custom = Boolean(theme.status?.[name]);
            return (
              <label
                key={name}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-xs"
              >
                <span
                  className="relative size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/15"
                  style={{ background: oklchToHex(colour) }}
                >
                  <input
                    type="color"
                    value={oklchToHex(colour)}
                    aria-label={`${name} colour`}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => {
                      const picked = hexToOklch(event.target.value);
                      if (picked)
                        set({ status: { ...theme.status, [name]: normalizeOklch(picked) } });
                    }}
                  />
                </span>
                <span className="grid">
                  <span className="capitalize">{name}</span>
                  <span className="text-muted-foreground">{custom ? "custom" : "default"}</span>
                </span>
                {custom && (
                  <button
                    type="button"
                    aria-label={`Reset ${name}`}
                    className="ml-auto cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={(event) => {
                      event.preventDefault();
                      const { [name]: _removed, ...rest } = theme.status ?? {};
                      set({ status: Object.keys(rest).length > 0 ? rest : undefined });
                    }}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <Heading>Contrast (light mode)</Heading>
        <ul className="grid gap-1.5 text-xs">
          {checks.map((check) => {
            const ok = check.ratio >= check.need;
            return (
              <li key={check.label} className="flex items-center gap-2">
                {ok ? (
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                ) : (
                  <TriangleAlert className="size-3.5 text-warning" aria-hidden="true" />
                )}
                <span className="flex-1">{check.label}</span>
                <span className="font-mono text-muted-foreground">
                  {check.ratio.toFixed(1)}:1 {contrastLevel(check.ratio)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-2">
        <Heading>Import a theme</Heading>
        <label htmlFor={`${id}-import`} className="text-xs text-muted-foreground">
          Paste the CSS of a shadcn or tweakcn theme (the :root and .dark blocks).
        </label>
        <Textarea
          id={`${id}-import`}
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          rows={4}
          className="font-mono text-xs"
          placeholder={":root {\n  --primary: oklch(0.6 0.2 250);\n}"}
        />
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={!pasted.trim()}
            onClick={() => {
              const result = importThemeCss(pasted, theme);
              if (result.imported === 0) {
                setMessage("No colours found. Paste the :root { … } and .dark { … } blocks.");
                return;
              }
              onChange(result.theme);
              setMessage(`Imported ${result.imported} colours.`);
              setPasted("");
            }}
          >
            Import
          </Button>
          {message && <span className="text-xs text-muted-foreground">{message}</span>}
        </div>
      </div>

      <details className="group grid gap-3">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground uppercase">
          Advanced: single colours {overrides.length > 0 && `(${overrides.length})`}
        </summary>
        <div className="mt-3 grid gap-3">
          <p className="text-xs text-muted-foreground">
            Replace one colour for light and dark. Use oklch(), hex, rgb() or hsl().
          </p>
          <select
            aria-label="Token"
            value={tokenName}
            onChange={(event) => setTokenName(event.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            {themeTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              aria-label="Light value"
              value={tokenLight}
              onChange={(event) => setTokenLight(event.target.value)}
              placeholder="Light: oklch(…)"
              className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
            />
            <input
              aria-label="Dark value"
              value={tokenDark}
              onChange={(event) => setTokenDark(event.target.value)}
              placeholder="Dark: oklch(…)"
              className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
            />
          </div>
          <Button size="sm" variant="outline" onClick={addToken}>
            Set colour
          </Button>
          {overrides.length > 0 && (
            <ul className="grid gap-1.5 text-xs">
              {overrides.map(([name, value]) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-md border border-border p-2"
                >
                  <span className="font-mono">{name}</span>
                  <span className="ml-auto truncate font-mono text-muted-foreground">
                    {[value.light, value.dark].filter(Boolean).join(" · ")}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      const { [name]: _removed, ...rest } = theme.tokens ?? {};
                      set({ tokens: Object.keys(rest).length > 0 ? rest : undefined });
                    }}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </div>
  );
}
