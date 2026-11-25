import type { ComponentProps } from "react";
import "flag-icons/css/flag-icons.min.css";
import { cn } from "../lib/cn";

type FlagProps = Omit<ComponentProps<"span">, "children"> & {
  /** Two-letter country code, any case: "nl", "NL". */
  code: string;
  /** The country name, for screen readers. Leave it out when the name is shown next to the flag. */
  label?: string;
};

/**
 * A country flag (flag-icons). Each flag is a small SVG that the browser loads
 * only when it is shown, so a list of 250 flags does not cost 250 downloads up front.
 * Size it with the font size: `text-xl` makes it bigger.
 */
export function Flag({ code, label, className, ...props }: FlagProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "fi shrink-0 rounded-[3px] ring-1 ring-foreground/10",
        `fi-${code.toLowerCase()}`,
        className,
      )}
      {...props}
    />
  );
}
