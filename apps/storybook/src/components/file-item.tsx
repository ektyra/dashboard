import type { ReactNode } from "react";
import { CircleCheck, FileText, X } from "lucide-react";
import { cn } from "../lib/cn";
import { formatBytes } from "../lib/format";
import { IconButton } from "./icon-button";
import { Progress } from "./progress";

type FileItemProps = Readonly<{
  name: string;
  size: number;
  /** 0 to 100 while uploading; leave out when there is no upload. */
  progress?: number;
  /** An image URL for a thumbnail. */
  previewUrl?: string;
  onRemove?: () => void;
  trailing?: ReactNode;
  className?: string;
}>;

/** One file in a list: thumbnail, name, size, progress and a remove button. */
export function FileItem({
  name,
  size,
  progress,
  previewUrl,
  onRemove,
  trailing,
  className,
}: FileItemProps) {
  const uploading = progress !== undefined && progress < 100;
  const done = progress === 100;
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 pr-2",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <FileText className="size-5" aria-hidden="true" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{name}</p>
        {uploading ? (
          <div className="mt-1.5 flex items-center gap-2">
            <Progress value={progress} className="h-1" aria-label={`Uploading ${name}`} />
            <span className="w-9 shrink-0 text-right text-xs text-muted-foreground">
              {progress}%
            </span>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {formatBytes(size)}
            {done && (
              <span className="flex items-center gap-1 text-success-text">
                <CircleCheck className="size-3.5" aria-hidden="true" />
                Uploaded
              </span>
            )}
          </p>
        )}
      </div>
      {trailing}
      {onRemove && (
        <IconButton label={`Remove ${name}`} onClick={onRemove} className="size-8">
          <X aria-hidden="true" />
        </IconButton>
      )}
    </li>
  );
}
