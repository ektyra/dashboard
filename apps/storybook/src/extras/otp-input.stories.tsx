import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OtpInput } from "../components/otp-input";

const meta = {
  title: "Extras/OTP input",
  component: OtpInput,
  args: { value: "", onChange: () => {}, label: "Verification code" },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div className="flex flex-col gap-2">
        <OtpInput {...args} value={value} onChange={setValue} />
        <p className="text-muted-foreground text-xs">Try pasting “123456”.</p>
      </div>
    );
  },
} satisfies Meta<typeof OtpInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SixDigits: Story = {};
export const FourDigits: Story = { args: { length: 4 } };
export const Invalid: Story = { args: { value: "123456", invalid: true } };
export const Disabled: Story = { args: { value: "12", disabled: true } };
