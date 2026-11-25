import { useSyncExternalStore } from "react";
import { storageKey } from "../../lib/storage-key";
import { builtInTheme, sanitizeTheme, themeCss } from "./theme";
import type { Theme } from "./theme";

/**
 * The look of the app that the theme customizer controls, kept as attributes on
 * `<html>` so it is right from the first paint (no flash on reload), the same way
 * the color scheme (`core/theme`) and the sidebar (`core/sidebar`) work:
 *
 * - `data-layout="horizontal"`: the menu runs across the top and there is no sidebar.
 * - `data-layout="detached"`: the sidebar floats as a rounded panel, apart from the page edge.
 * - `data-width="boxed"`: the page content stays in a centered column.
 * - `data-palette="…"`: a color palette (see `core/styles/palettes.css`).
 * - `data-preloader="…"`: the animation shown while the app loads.
 *
 * Every choice is an attribute, the default included, so a client can start with its own
 * palette or layout (`configureAppearance`). Dark mode and the sidebar width are separate
 * (`@ektyra/ui/theme`, `sidebar-state`).
 */

export const layouts = ["vertical", "horizontal", "detached"] as const;
export const widths = ["fluid", "boxed"] as const;
export const preloaders = ["none", "rotating", "spinning", "loading"] as const;
export const palettes = [
  "default",
  "claude",
  "amber",
  "ocean",
  "violet",
  "nature",
  "catppuccin",
  "supabase",
  "custom",
] as const;

export type Layout = (typeof layouts)[number];
export type Width = (typeof widths)[number];
export type Preloader = (typeof preloaders)[number];
export type Palette = (typeof palettes)[number];

export type Appearance = {
  layout: Layout;
  width: Width;
  palette: Palette;
  preloader: Preloader;
};

/** What the template ships with. */
export const builtInAppearance: Appearance = {
  layout: "vertical",
  width: "fluid",
  palette: "default",
  preloader: "none",
};

/** What a visitor sees until they choose. Set once with `configureAppearance`. */
export let defaultAppearance: Appearance = builtInAppearance;
let snapshot: Appearance = defaultAppearance;

/**
 * Sets the starting look. Call it once at startup, on the server and in the browser, before
 * anything renders. Values that are not known choices are ignored.
 */
export function configureAppearance(next: { [K in keyof Appearance]?: string }) {
  const merged = { ...builtInAppearance };
  for (const key of Object.keys(attributes) as (keyof Appearance)[]) {
    const value = next[key];
    if (isChoice(key, value)) (merged[key] as string) = value;
  }
  defaultAppearance = merged;
  snapshot = merged;
}

/** The `data-*` attributes for `<html>`, so the server renders the starting look. */
export const appearanceAttributes = (): Record<string, string> =>
  Object.fromEntries(
    (Object.keys(attributes) as (keyof Appearance)[]).map((key) => [
      attributes[key],
      defaultAppearance[key],
    ]),
  );

const appearanceKey = () => storageKey("appearance");

const attributes = {
  layout: "data-layout",
  width: "data-width",
  palette: "data-palette",
  preloader: "data-preloader",
} as const satisfies Record<keyof Appearance, string>;

const choices = { layout: layouts, width: widths, palette: palettes, preloader: preloaders };

function isChoice<K extends keyof Appearance>(key: K, value: unknown): value is Appearance[K] {
  return (choices[key] as readonly unknown[]).includes(value);
}

/**
 * Inline script for <head>: restores the saved choices before first paint. It runs before
 * any module has loaded, so it repeats the read-and-apply steps below in a few lines.
 */
export { builtInBrand, builtInTheme } from "./theme";
export type { Brand, Theme } from "./theme";

const THEME_STYLE_ID = "ektyra-theme";
const themeKey = () => storageKey("theme");
const themeCssKey = () => storageKey("theme-css");

let defaultTheme: Theme = builtInTheme;
let themeSnapshot: Theme = builtInTheme;
const themeListeners = new Set<() => void>();

/** The starting theme, from ektyra.config.ts. Call once at startup, like `configureAppearance`. */
export function configureCustomTheme(next: unknown) {
  const theme = sanitizeTheme(next);
  if (!theme) return;
  defaultTheme = theme;
  themeSnapshot = theme;
}

/** The stylesheet text for the project's theme, rendered into `<head>` so the first byte is right. */
export const themeStyleText = () => themeCss(defaultTheme);
export const themeStyleId = THEME_STYLE_ID;

function applyTheme(theme: Theme) {
  let element = document.getElementById(THEME_STYLE_ID);
  if (!element) {
    element = document.createElement("style");
    element.id = THEME_STYLE_ID;
    document.head.append(element);
  }
  element.textContent = themeCss(theme);
}

/** Sets the theme for this browser and remembers it. */
export function setCustomTheme(theme: Theme) {
  const clean = sanitizeTheme(theme);
  if (!clean) return;
  themeSnapshot = clean;
  applyTheme(clean);
  try {
    localStorage.setItem(themeKey(), JSON.stringify(clean));
    localStorage.setItem(themeCssKey(), themeCss(clean));
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
  themeListeners.forEach((listener) => listener());
}

/** Goes back to the project's own theme. */
export function resetCustomTheme() {
  themeSnapshot = defaultTheme;
  applyTheme(defaultTheme);
  try {
    localStorage.removeItem(themeKey());
    localStorage.removeItem(themeCssKey());
  } catch {
    /* storage unavailable */
  }
  themeListeners.forEach((listener) => listener());
}

/** The current theme. The server always says the project default; the browser corrects it. */
export function useCustomTheme(): Theme {
  return useSyncExternalStore(
    (listener) => {
      themeListeners.add(listener);
      return () => themeListeners.delete(listener);
    },
    () => {
      try {
        const raw = localStorage.getItem(themeKey());
        const stored = raw ? sanitizeTheme(JSON.parse(raw)) : undefined;
        if (stored && JSON.stringify(stored) !== JSON.stringify(themeSnapshot)) {
          themeSnapshot = stored;
        }
      } catch {
        /* keep the snapshot */
      }
      return themeSnapshot;
    },
    () => defaultTheme,
  );
}

export const getAppearanceInitScript = () =>
  `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
    appearanceKey(),
  )})||"{}");var a=${JSON.stringify(attributes)};var d=${JSON.stringify(
    defaultAppearance,
  )};var c=${JSON.stringify(choices)};var tc=localStorage.getItem(${JSON.stringify(
    themeCssKey(),
  )});if(tc){var te=document.getElementById(${JSON.stringify(THEME_STYLE_ID)});if(!te){te=document.createElement("style");te.id=${JSON.stringify(THEME_STYLE_ID)};document.head.appendChild(te)}te.textContent=tc}for(var k in a){var v=s[k];if(v&&c[k].indexOf(v)>-1)document.documentElement.setAttribute(a[k],v);else document.documentElement.setAttribute(a[k],d[k])}}catch(e){}})();`;

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function readAppearance(): Appearance {
  const root = document.documentElement;
  const next = { ...defaultAppearance };
  for (const key of Object.keys(attributes) as (keyof Appearance)[]) {
    const value = root.getAttribute(attributes[key]);
    if (isChoice(key, value)) (next[key] as string) = value;
  }
  const same = (Object.keys(next) as (keyof Appearance)[]).every(
    (key) => next[key] === snapshot[key],
  );
  if (!same) snapshot = next;
  return snapshot;
}

export function setAppearance<K extends keyof Appearance>(key: K, value: Appearance[K]) {
  const root = document.documentElement;
  root.setAttribute(attributes[key], value);
  try {
    localStorage.setItem(appearanceKey(), JSON.stringify(readAppearance()));
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
  listeners.forEach((listener) => listener());
}

export function resetAppearance() {
  resetCustomTheme();
  for (const key of Object.keys(attributes) as (keyof Appearance)[]) {
    document.documentElement.setAttribute(attributes[key], defaultAppearance[key]);
  }
  try {
    localStorage.removeItem(appearanceKey());
  } catch {
    /* storage unavailable */
  }
  readAppearance();
  listeners.forEach((listener) => listener());
}

/** The current choices. The server always says the defaults; the browser corrects it right away. */
export function useAppearance(): Appearance {
  return useSyncExternalStore(subscribe, readAppearance, () => snapshot);
}
