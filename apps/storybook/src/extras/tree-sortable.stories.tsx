import type { Meta, StoryObj } from "@storybook/react-vite";
import { File, Folder } from "lucide-react";
import { useState } from "react";
import { SortableList } from "../components/sortable-list";
import { TreeView, type TreeNode } from "../components/tree-view";

const meta = {
  title: "Extras/TreeView and SortableList",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const nodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Folder />,
        children: [
          { id: "button", label: "button.tsx", icon: <File /> },
          { id: "card", label: "card.tsx", icon: <File /> },
        ],
      },
      { id: "index", label: "index.ts", icon: <File /> },
    ],
  },
  { id: "readme", label: "README.md", icon: <File /> },
];

export const Tree: Story = {
  render: () => {
    const [selected, setSelected] = useState("button");
    return (
      <div className="w-72">
        <TreeView
          nodes={nodes}
          defaultExpanded={["src", "components"]}
          selectedId={selected}
          onSelect={(n) => setSelected(n.id)}
        />
      </div>
    );
  },
};

export const Sortable: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: "1", name: "Design" },
      { id: "2", name: "Build" },
      { id: "3", name: "Review" },
      { id: "4", name: "Ship" },
    ]);
    return (
      <div className="w-72">
        <SortableList
          items={items}
          onChange={setItems}
          renderItem={(item) => <span className="text-sm">{item.name}</span>}
        />
        <p className="text-muted-foreground mt-3 text-xs">
          Drag the handle, or focus it and use Space and the arrow keys.
        </p>
      </div>
    );
  },
};
