import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../components/label";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";

const meta = { title: "Inputs & Forms/Radio", component: RadioGroup } satisfies Meta<
  typeof RadioGroup
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="monthly" aria-label="Billing">
      {[
        ["monthly", "Monthly"],
        ["yearly", "Yearly (2 months free)"],
        ["lifetime", "Lifetime (sold out)"],
      ].map(([v, l]) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem id={`r-${v}`} value={v} disabled={v === "lifetime"} />
          <Label htmlFor={`r-${v}`}>{l}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
