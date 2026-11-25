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
  };
  api.on(GLOBALS_UPDATED, apply);
  apply();
});
