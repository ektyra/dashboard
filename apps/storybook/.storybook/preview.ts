import type { Preview } from "@storybook/react-vite";
import "@ektyra/ui/styles.css";

const preview: Preview = {
  parameters: { layout: "centered", controls: { expanded: true } },
};

export default preview;
