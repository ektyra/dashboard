import { useRef, useState } from "react";
import type { ComponentProps } from "react";
import { Paperclip, X } from "lucide-react";
import { cn } from "../lib/cn";
import { formatBytes } from "../lib/format";

type FileInputProps = Omit<ComponentProps<"input">, "type" | "value" | "children"> & {
  /** Called with the chosen files, or an empty list when cleared. */
  onFilesChange?: (files: File[]) => void;
  buttonLabel?: string;
  placeholder?: string;
};

/**
 * The browser's file picker in the look of the other fields. The whole field is
 * the click target and the real input is underneath, so keyboard, drag and drop
 * from the desktop, and screen readers all work as usual.
 */
export function FileInput({
  className,
  onFilesChange,
  onChange,
  buttonLabel = "Choose file",
  placeholder = "No file chosen",
  multiple,
  disabled,
  ...props
}: FileInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const summary =
    files.length === 0
      ? placeholder
      : files.length === 1
        ? `${files[0]?.name} (${formatBytes(files[0]?.size ?? 0)})`
        : `${files.length} files chosen`;

  const clear = () => {
    if (input.current) input.current.value = "";
    setFiles([]);
    onFilesChange?.([]);
  };

  return (
    <div
      className={cn(
        "relative flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring has-[:disabled]:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-[3px] has-[[aria-invalid=true]]:ring-destructive/15",
        !disabled && "hover:bg-muted/40",
        className,
      )}
    >
      <input
        ref={input}
        type="file"
        multiple={multiple}
        disabled={disabled}
        className="peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(event) => {
          const chosen = Array.from(event.target.files ?? []);
          setFiles(chosen);
          onFilesChange?.(chosen);
          onChange?.(event);
        }}
        {...props}
      />
      <span className="pointer-events-none flex h-full shrink-0 items-center gap-2 border-r border-input bg-muted px-3 text-sm">
        <Paperclip className="size-4 text-muted-foreground" aria-hidden="true" />
        {buttonLabel}
      </span>
      <span
        className={cn(
          "pointer-events-none min-w-0 flex-1 truncate px-3 text-sm",
          files.length === 0 && "text-muted-foreground",
        )}
      >
        {summary}
      </span>
      {files.length > 0 && !disabled && (
        <button
          type="button"
          aria-label="Clear the chosen files"
          onClick={clear}
          className="relative z-10 mr-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
