/// <reference path="./css.d.ts" />
import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@fontsource-variable/manrope";
import "@ektyra/ui/styles.css";
import "./preview.css";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    backgrounds: { disabled: true }, // the theme toggle owns the background
    docs: { toc: true },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: prefersDark ? "dark" : "light",
    }),
  ],
};

export default preview;
