import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
  viteFinal: (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
