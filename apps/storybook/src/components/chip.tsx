import type { ComponentProps, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

type ChipProps = Omit<ComponentProps<"button">, "children" | "onClick"> & {
  children: ReactNode;
  /** Makes the chip a toggle (a filter). */
  selected?: boolean;
  /** Called when the chip is clicked. Without it (and without `onRemove`) the chip is plain text. */
  onClick?: () => void;
  /** Shows a remove button. Gets its own accessible name: "Remove <label>". */
  onRemove?: () => void;
  /** Used in the remove button's accessible name when `children` is not plain text. */
  label?: string;
};

const base =
  "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

/**
 * A compact, interactive tag: a filter that toggles, or a value you can remove.
 * (Badge is for read-only status; Chip is for things the user acts on.)
 */
export function Chip({
  children,
  selected = false,
  onClick,
  onRemove,
  label,
  className,
  disabled,
  ...props
}: ChipProps) {
  const text = label ?? (typeof children === "string" ? children : "item");
  const look = selected
    ? "border-primary bg-primary/10 text-primary"
    : "border-border bg-background text-foreground";

  return (
    <span className={cn("inline-flex items-center", disabled && "opacity-50")}>
      {onClick ? (
        <button
          type="button"
          aria-pressed={selected}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            base,
            look,
            "cursor-pointer hover:bg-muted",
            onRemove && "rounded-r-none border-r-0",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      ) : (
        <span className={cn(base, look, onRemove && "rounded-r-none border-r-0", className)}>
          {children}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          disabled={disabled}
          aria-label={`Remove ${text}`}
          onClick={onRemove}
          className={cn(
            "inline-grid h-7 w-7 cursor-pointer place-items-center rounded-r-full border text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            selected ? "border-primary" : "border-border",
            !onClick && "rounded-l-none",
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
