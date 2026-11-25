import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dropzone } from "../components/dropzone";
import { FileInput } from "../components/file-input";
import { FileItem } from "../components/file-item";

const meta = {
  title: "Inputs & Forms/FileUpload",
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Input: Story = {
  render: () => {
    const [names, setNames] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-2">
        <FileInput
          aria-label="Upload a file"
          onFilesChange={(files) => setNames(files.map((f) => f.name))}
        />
        <p className="text-muted-foreground text-xs">
          {names.length ? names.join(", ") : "No file chosen"}
        </p>
      </div>
    );
  },
};

export const DropArea: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Dropzone
          onFilesAccepted={(accepted) => setFiles((f) => [...f, ...accepted])}
          maxSize={5 * 1024 * 1024}
          hint="PNG or PDF, up to 5 MB"
        />
        {files.map((f, i) => (
          <FileItem
            key={`${f.name}-${i}`}
            name={f.name}
            size={f.size}
            onRemove={() => setFiles((all) => all.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    );
  },
};

export const DropAreaDisabled: Story = {
  render: () => <Dropzone onFilesAccepted={() => {}} disabled />,
};

export const FileItems: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <FileItem name="report-q3.pdf" size={2_400_000} />
      <FileItem name="photo.png" size={820_000} progress={42} />
      <FileItem name="notes.txt" size={1200} onRemove={() => {}} />
    </div>
  ),
};
