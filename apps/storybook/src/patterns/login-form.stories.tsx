import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginForm } from "./login-form";

const meta = {
  title: "Patterns/LoginForm",
  component: LoginForm,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LoginForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InviteOnly: Story = { args: { showSignUp: false } };
export const WrongPassword: Story = {
  name: "Try it: password “wrong” shows the error",
  args: { showSignUp: true },
};
