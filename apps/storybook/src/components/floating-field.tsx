import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

type FloatingProps = Readonly<{
  /** Required: it is the field's label, and also its placeholder until you type. */
  label: string;
  id: string;
  /** An icon at the start of the field. */
  icon?: ReactNode;
}>;

const controlClass =
  "peer w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

const labelClass =
  "pointer-events-none absolute origin-left text-muted-foreground transition-all duration-150 ease-out peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs peer-disabled:opacity-50 peer-aria-invalid:text-destructive-text";

/**
 * An input whose label sits inside the field and floats up and shrinks when
 * you focus the field or type. It saves space and still keeps the label visible.
 * Not for date or time inputs, which always show a value.
 */
export function FloatingInput({
  id,
  label,
  icon,
  className,
  ...props
}: FloatingProps & Omit<ComponentProps<"input">, "id" | "placeholder">) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
      )}
      <input
        id={id}
        // A single space lets CSS tell "empty" from "has text" (:placeholder-shown).
        placeholder=" "
        className={cn(controlClass, "h-12 pt-4 pb-1", icon && "pl-10", className)}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(labelClass, "top-3.5 text-sm", icon ? "left-10" : "left-3")}
      >
        {label}
      </label>
    </div>
  );
}

export function FloatingTextarea({
  id,
  label,
  className,
  ...props
}: Omit<FloatingProps, "icon"> & Omit<ComponentProps<"textarea">, "id" | "placeholder">) {
  return (
    <div className="relative">
      <textarea
        id={id}
        placeholder=" "
        className={cn(controlClass, "min-h-28 resize-y pt-6 pb-2", className)}
        {...props}
      />
      <label htmlFor={id} className={cn(labelClass, "top-3.5 left-3 text-sm")}>
        {label}
      </label>
    </div>
  );
}
