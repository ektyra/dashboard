import type { ComponentProps, ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "../lib/cn";
import { Label } from "./label";

/** A stack of fields with even spacing. */
export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-5", className)} {...props} />;
}

/**
 * One form field: a label, the control, a description and an error.
 * `vertical` puts the label above; `horizontal` puts it beside the control.
 */
export function Field({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<"div"> & { orientation?: "vertical" | "horizontal" }) {
  return (
    <div
      data-orientation={orientation}
      className={cn(
        "grid gap-2",
        orientation === "horizontal" && "sm:grid-cols-[12rem_1fr] sm:items-start sm:gap-x-6",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label className={cn("leading-snug", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

/**
 * The error under a field: a soft red bar with an icon, so it is easy to notice
 * without shouting. It slides in, and is announced to screen readers.
 * Pass messages (strings), or error objects with a `message`.
 */
export function FieldError({
  errors,
  className,
  ...props
}: ComponentProps<"p"> & { errors?: ReadonlyArray<unknown> }) {
  const first = errors?.find(Boolean);
  if (!first) return null;
  const message =
    typeof first === "string" ? first : (first as { message?: string } | undefined)?.message;
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn(
        "animate-field-error flex items-start gap-2 rounded-md bg-destructive/10 px-2.5 py-1.5 text-sm text-destructive-text motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

/** A green confirmation under a field, in the same shape as an error. */
export function FieldSuccess({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "animate-field-error flex items-start gap-2 rounded-md bg-success/10 px-2.5 py-1.5 text-sm text-success-text motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** A group of related controls (for example checkboxes) with a visible title. */
export function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return <fieldset className={cn("grid content-start gap-3", className)} {...props} />;
}

export function FieldLegend({ className, ...props }: ComponentProps<"legend">) {
  return <legend className={cn("mb-1 text-sm", className)} {...props} />;
}

type FormRowProps = Readonly<{
  label: string;
  htmlFor?: string;
  description?: string;
  errors?: ReadonlyArray<unknown>;
  /** `vertical`: label above. `horizontal`: label in a column to the left. */
  orientation?: "vertical" | "horizontal";
  /** Where the label text sits in the label column (horizontal only). */
  labelAlign?: "start" | "end";
  required?: boolean;
  children: ReactNode;
  className?: string;
}>;

/**
 * A label, a control, a description and an error, in either direction. One
 * component for both so a form can switch layout without being rewritten. In
 * the horizontal layout the width of the label column is `--form-label-width`.
 * It goes horizontal when its box is wide enough (a container query), so it
 * also works in a half-width column. It stacks when the box is narrow.
 */
export function FormRow({
  label,
  htmlFor,
  description,
  errors,
  orientation = "vertical",
  labelAlign = "start",
  required,
  children,
  className,
}: FormRowProps) {
  const labelContent = (
    <FieldLabel htmlFor={htmlFor}>
      {label}
      {required && (
        <span className="text-destructive-text" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </FieldLabel>
  );

  if (orientation === "vertical") {
    return (
      <div className={cn("grid content-start gap-2", className)}>
        {labelContent}
        {children}
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={errors} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-2 @xl:grid-cols-[var(--form-label-width,13rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <div
        className={cn(
          "grid content-start gap-1 @xl:pt-2",
          labelAlign === "end" && "@xl:text-right",
        )}
      >
        {labelContent}
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>
      <div className="grid content-start gap-2">
        {children}
        <FieldError errors={errors} />
      </div>
    </div>
  );
}
