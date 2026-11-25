import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, MultiSelect, type ComboboxOption } from "../components/combobox";
import { CountrySelect, LanguageSelect } from "../components/country-select";
import { Field, FieldLabel } from "../components/field";
import { NativeSelect } from "../components/native-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const meta = {
  title: "Inputs & Forms/Select",
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const fruits: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
];

export const Basic: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry" disabled>
            Cherry (sold out)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Native: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="ns">Plan</FieldLabel>
      <NativeSelect id="ns" defaultValue="pro">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="team">Team</option>
      </NativeSelect>
    </Field>
  ),
};

export const NativeLoading: Story = {
  render: () => (
    <NativeSelect loading aria-label="Loading options">
      <option>Loading…</option>
    </NativeSelect>
  ),
};

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("mango");
    return (
      <Combobox
        options={fruits}
        value={value}
        onValueChange={setValue}
        placeholder="Pick a fruit"
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["apple", "grape"]);
    return (
      <MultiSelect
        options={fruits}
        value={value}
        onValueChange={setValue}
        placeholder="Pick fruit"
      />
    );
  },
};

export const Country: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("nl");
    return <CountrySelect value={value} onValueChange={setValue} />;
  },
};

export const Language: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <LanguageSelect value={value} onValueChange={setValue} />;
  },
};
