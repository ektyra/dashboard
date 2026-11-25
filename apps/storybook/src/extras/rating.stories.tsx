import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Rating } from "../components/rating";

const meta = {
  title: "Extras/Rating",
  component: Rating,
  args: { value: 3, label: "Rating" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    max: { control: { type: "number", min: 3, max: 10 } },
    allowHalf: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Rating {...args} value={value} onValueChange={args.readOnly ? undefined : setValue} />;
  },
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const HalfStars: Story = { args: { value: 3.5, allowHalf: true } };
export const ReadOnly: Story = { args: { value: 4, readOnly: true } };
export const Large: Story = { args: { size: "lg", max: 10, value: 7 } };
