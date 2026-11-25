import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileManager, type FileEntry } from "../components/file-manager";

const seed: FileEntry[] = [
  { id: "d1", name: "Brand", kind: "folder", parent: null, modified: "Mon" },
  { id: "d2", name: "Invoices", kind: "folder", parent: null, modified: "Tue" },
  { id: "d3", name: "2026", kind: "folder", parent: "d2", modified: "Tue" },
  {
    id: "f1",
    name: "logo.svg",
    kind: "file",
    parent: "d1",
    size: 4200,
    mime: "image/svg+xml",
    modified: "Mon",
  },
  {
    id: "f2",
    name: "guidelines.pdf",
    kind: "file",
    parent: "d1",
    size: 2_400_000,
    mime: "application/pdf",
    modified: "Mon",
  },
  {
    id: "f3",
    name: "INV-004.pdf",
    kind: "file",
    parent: "d3",
    size: 120_000,
    mime: "application/pdf",
    modified: "Tue",
  },
  {
    id: "f4",
    name: "notes.txt",
    kind: "file",
    parent: null,
    size: 1200,
    mime: "text/plain",
    modified: "Wed",
  },
  {
    id: "f5",
    name: "photo.png",
    kind: "file",
    parent: null,
    size: 820_000,
    mime: "image/png",
    modified: "Wed",
  },
];

const meta = {
  title: "Inputs & Forms/File manager (Pro)",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [entries, setEntries] = useState(seed);
    return (
      <div className="w-[48rem] max-w-full">
        <FileManager entries={entries} onChange={setEntries} />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    return (
      <div className="w-[48rem] max-w-full">
        <FileManager entries={entries} onChange={setEntries} />
      </div>
    );
  },
};
