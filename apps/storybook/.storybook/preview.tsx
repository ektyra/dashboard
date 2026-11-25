/// <reference path="./css.d.ts" />
import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@fontsource-variable/manrope";
import "../src/styles.css";
import "./preview.css";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { withProviders } from "./providers";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Docs-only (MDX) pages render no story, so the theme decorator never runs there.
// Mirror the toolbar choice onto <html> ourselves so those pages follow light/dark too.
const syncTheme = ({ globals }: { globals?: { theme?: string } }) => {
  if (globals?.theme) document.documentElement.classList.toggle("dark", globals.theme === "dark");
};
addons.getChannel().on(SET_GLOBALS, syncTheme);
addons.getChannel().on(GLOBALS_UPDATED, syncTheme);

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    backgrounds: { disabled: true }, // the theme toggle owns the background
    docs: { toc: true },
    options: {
      storySort: {
        order: [
          "Welcome",
          "Foundations",
          "Actions",
          "Inputs & Forms",
          "Navigation",
          "Data Display",
          "Feedback",
          "Overlays",
          "Layout",
          "Typography",
          "Media",
          "Patterns",
          "Templates",
          "Extras",
        ],
      },
    },
    viewport: {
      options: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "812px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "800px" } },
      },
    },
  },
  decorators: [
    withProviders,
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: prefersDark ? "dark" : "light",
    }),
  ],
};

export default preview;
