import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchBar } from "./search-bar";

const meta = {
  title: "Patterns/SearchBar",
  component: SearchBar,
  args: { value: "", onChange: () => {} },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SearchBar {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof SearchBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Search orders" } };
export const WithShortcut: Story = { args: { shortcut: "/" } };
export const WithValue: Story = { args: { value: "invoice" } };
export const Loading: Story = { args: { value: "invoice", loading: true } };
