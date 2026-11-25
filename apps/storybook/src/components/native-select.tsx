import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/** The browser's own select, styled to match. Best on phones, where the native picker is nicest. */
export function NativeSelect({
  className,
  children,
  loading = false,
  disabled,
  ...props
}: ComponentProps<"select"> & {
  /** Shows a spinner and blocks the select while its options load. */
  loading?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-background pr-9 pl-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </select>
      {loading ? (
        <Spinner
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          aria-label="Loading"
        />
      ) : (
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
