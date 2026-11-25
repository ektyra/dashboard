import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { CheckboxCard, RadioCard } from "../components/choice-card";
import { RadioGroup } from "../components/radio-group";

const meta: Meta = { title: "Extras/ChoiceCard", component: RadioCard };
export default meta;
type Story = StoryObj;

export const Radio: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="w-96 gap-3" aria-label="Payment method">
      <RadioCard
        value="card"
        title="Credit card"
        description="Visa, Mastercard, Amex"
        icon={<CreditCard />}
      />
      <RadioCard
        value="bank"
        title="Bank transfer"
        description="1–2 business days"
        icon={<Landmark />}
      />
      <RadioCard
        value="wallet"
        title="Wallet"
        description="Not available in your country"
        icon={<Wallet />}
        disabled
      />
    </RadioGroup>
  ),
};

export const Checkbox: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <CheckboxCard title="Email updates" description="Weekly summary" defaultChecked />
      <CheckboxCard
        title="SMS alerts"
        description="Only for urgent issues"
        aside={<span className="text-muted-foreground text-xs">+€1/mo</span>}
      />
    </div>
  ),
};
