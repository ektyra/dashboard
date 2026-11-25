import { addons } from "storybook/manager-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { dark, light } from "./theme";

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({ theme: systemDark() ? dark : light });

// Keep Storybook's own UI in step with the light/dark toolbar toggle.
addons.register("ektyra/theme-sync", (api) => {
  const apply = () => {
    const chosen = (api.getGlobals() as { theme?: string }).theme;
    const isDark = chosen ? chosen === "dark" : systemDark();
    api.setOptions({ theme: isDark ? dark : light });
    const root = document.documentElement.style;
    root.setProperty("--ek-selected-bg", isDark ? "#292850" : "#e4e6ff");
    root.setProperty("--ek-selected-fg", isDark ? "#e0e2ff" : "#291970");
  };
  api.on(GLOBALS_UPDATED, apply);
  apply();
});
