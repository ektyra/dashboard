import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.tsx";

const meta = { title: "ui/Button", component: Button, args: { children: "Button" } } satisfies Meta<
  typeof Button
>;
export default meta;

export const Primary: StoryObj<typeof meta> = {};
export const Ghost: StoryObj<typeof meta> = { args: { variant: "ghost" } };
