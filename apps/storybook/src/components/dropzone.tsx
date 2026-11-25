import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { Accept, FileRejection } from "react-dropzone";
import { cn } from "../lib/cn";
import { formatBytes } from "../lib/format";

type DropzoneProps = Readonly<{
  onFilesAccepted: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /** For example `{ "image/*": [] }`. */
  accept?: Accept;
  /** In bytes. */
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  title?: string;
  hint?: string;
  className?: string;
}>;

/**
 * A drop area for files. You can also click it, or tab to it and press Enter,
 * to open the file picker. Files that break the rules (type, size, count) are
 * reported through `onFilesRejected`.
 */
export function Dropzone({
  onFilesAccepted,
  onFilesRejected,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  title = "Drop files here, or click to browse",
  hint,
  className,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDropAccepted: onFilesAccepted,
    onDropRejected: onFilesRejected,
    accept,
    maxSize,
    maxFiles,
    multiple,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input p-8 text-center outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
        isDragActive && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input {...getInputProps()} />
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full bg-muted text-muted-foreground transition-colors",
          isDragActive && "bg-primary/15 text-primary",
        )}
      >
        <UploadCloud className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm">{isDragActive ? "Drop to add" : title}</p>
      <p className="text-xs text-muted-foreground">
        {hint ?? (maxSize ? `Up to ${formatBytes(maxSize)} each` : "Any file type")}
      </p>
    </div>
  );
}
