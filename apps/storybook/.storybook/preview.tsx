/// <reference path="./css.d.ts" />
import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@fontsource-variable/manrope";
import "@ektyra/ui/styles.css";
import "./preview.css";
import { withProviders } from "./providers";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

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
