import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Chip } from "../components/chip";

const meta = {
  title: "Data Display/Chip",
  component: Chip,
  args: { children: "Design" },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const Filters: Story = {
  render: () => {
    const all = ["Design", "Engineering", "Marketing", "Sales"];
    const [on, setOn] = useState<string[]>(["Design"]);
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label="Departments">
        {all.map((t) => (
          <Chip
            key={t}
            selected={on.includes(t)}
            onClick={() =>
              setOn((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
            }
          >
            {t}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Chip key={t} onRemove={() => setTags((cur) => cur.filter((x) => x !== t))}>
            {t}
          </Chip>
        ))}
        {tags.length === 0 && <span className="text-muted-foreground text-sm">No tags</span>}
      </div>
    );
  },
};

export const SelectableAndRemovable: Story = {
  render: () => (
    <Chip selected onClick={() => {}} onRemove={() => {}}>
      Status: Active
    </Chip>
  ),
};

export const Disabled: Story = { args: { disabled: true, onClick: () => {} } };
