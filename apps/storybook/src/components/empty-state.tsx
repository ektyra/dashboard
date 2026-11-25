import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Usually a Button. */
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-10 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div>
        <p className="text-base tracking-tight">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
