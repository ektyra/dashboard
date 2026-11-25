import type { Meta, StoryObj } from "@storybook/react-vite";
import { addDays, startOfMonth, subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "../components/calendar";
import { DatePicker, DateRangePicker } from "../components/date-picker";
import { DateTimePicker } from "../components/date-time-picker";

const meta = { title: "Inputs & Forms/DatePicker" } satisfies Meta;
export default meta;
type Story = StoryObj;

const today = new Date();

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();
    return <DatePicker value={value} onChange={setValue} placeholder="Pick a date" />;
  },
};

export const WithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(today);
    return (
      <DatePicker
        value={value}
        onChange={setValue}
        presets={[
          { label: "Today", value: today },
          { label: "Tomorrow", value: addDays(today, 1) },
          { label: "Next week", value: addDays(today, 7) },
        ]}
      />
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>({
      from: subDays(today, 6),
      to: today,
    });
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        presets={[
          { label: "Last 7 days", value: { from: subDays(today, 6), to: today } },
          { label: "This month", value: { from: startOfMonth(today), to: today } },
        ]}
      />
    );
  },
};

export const DateAndTime: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();
    return <DateTimePicker value={value} onChange={setValue} />;
  },
};

export const CalendarOnly: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(today);
    return (
      <Calendar
        mode="single"
        selected={value}
        onSelect={setValue}
        className="border-border rounded-lg border"
      />
    );
  },
};
