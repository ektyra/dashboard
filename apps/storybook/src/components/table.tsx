import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type TableProps = ComponentProps<"table"> & {
  /** Alternate row shading. */
  striped?: boolean;
  /** Lines between cells as well as rows. */
  bordered?: boolean;
  /** Row height. */
  density?: "compact" | "default" | "relaxed";
  /** Class for the box around the table (the part that scrolls sideways). */
  wrapperClassName?: string;
};

const densityClass = {
  compact: "[&_td]:py-1.5 [&_th]:h-8",
  default: "",
  relaxed: "[&_td]:py-4 [&_th]:h-12",
} as const;

export function Table({
  className,
  wrapperClassName,
  striped,
  bordered,
  density = "default",
  ...props
}: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border", wrapperClassName)}>
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          striped && "[&_tbody_tr:nth-child(even)]:bg-muted/40",
          bordered &&
            "[&_td:not(:last-child)]:border-r [&_th:not(:last-child)]:border-r [&_td]:border-border [&_th]:border-border",
          densityClass[density],
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("border-b border-border bg-muted/50", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("[&>tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border transition-colors hover:bg-muted/40", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn("h-10 px-4 text-left align-middle text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption className={cn("p-3 text-xs text-muted-foreground", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("border-t border-border bg-muted/50 [&>tr]:hover:bg-transparent", className)}
      {...props}
    />
  );
}
