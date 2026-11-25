import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ForgotPasswordForm,
  RegisterForm,
  ResetPasswordForm,
  TwoStepForm,
} from "../patterns/auth-forms";
import { LoginForm } from "../patterns/login-form";
import { AuthLayout } from "../shell/auth/auth-layout";

const meta = {
  title: "Templates/Auth pages",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AuthLayout>
        <Story />
      </AuthLayout>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Login: Story = { render: () => <LoginForm /> };
export const Register: Story = { render: () => <RegisterForm /> };
export const ForgotPassword: Story = {
  name: "Forgot password",
  render: () => <ForgotPasswordForm />,
};
export const ResetPassword: Story = { name: "Reset password", render: () => <ResetPasswordForm /> };
export const TwoStepVerification: Story = {
  name: "Two-step verification",
  render: () => <TwoStepForm />,
};
