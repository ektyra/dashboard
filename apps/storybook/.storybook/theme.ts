import { create } from "storybook/theming";

// Hex values are the sRGB equivalents of the OKLCH tokens in
// packages/ui/src/styles/theme.css (Storybook's theme API needs sRGB).
const base = {
  brandTitle: "Ektyra UI",
  brandUrl: "/",
  brandTarget: "_self",
  fontBase: '"Manrope Variable", ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  appBorderRadius: 8,
  inputBorderRadius: 8,
};

export const light = create({
  base: "light",
  ...base,
  brandImage: "./logo-light.svg",
  colorPrimary: "#6041ec",
  colorSecondary: "#6041ec",
  appBg: "#f6f6f9", // --sidebar
  appContentBg: "#fdfcfd", // --background
  appPreviewBg: "#fdfcfd",
  appBorderColor: "#e2e2e8", // --border
  barBg: "#ffffff", // --card
  barTextColor: "#5c5c69", // --muted-foreground
  barSelectedColor: "#6041ec",
  barHoverColor: "#6041ec",
  textColor: "#14141a", // --foreground
  textMutedColor: "#5c5c69",
  inputBg: "#ffffff",
  inputBorder: "#d6d7de", // --input
  inputTextColor: "#14141a",
});

export const dark = create({
  base: "dark",
  ...base,
  brandImage: "./logo-dark.svg",
  colorPrimary: "#7362fc",
  colorSecondary: "#7362fc",
  appBg: "#131319", // --sidebar
  appContentBg: "#0d0d12", // --background
  appPreviewBg: "#0d0d12",
  appBorderColor: "#2d2d35", // --border
  barBg: "#15151c", // --card
  barTextColor: "#a3a3b1", // --muted-foreground
  barSelectedColor: "#7362fc",
  barHoverColor: "#7362fc",
  textColor: "#f5f5f8", // --foreground
  textMutedColor: "#a3a3b1",
  inputBg: "#15151c",
  inputBorder: "#373740", // --input
  inputTextColor: "#f5f5f8",
});
