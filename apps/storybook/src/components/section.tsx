import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Heading } from "./heading";
import { Text } from "./text";

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  description?: string;
  /** Buttons or links shown on the right of the title. */
  actions?: ReactNode;
  /** Heading level of the title. Default 2. */
  level?: 2 | 3 | 4;
};

/** A titled part of a page. The section is named by its heading for screen readers. */
export function Section({
  title,
  description,
  actions,
  level = 2,
  className,
  children,
  id,
  ...props
}: SectionProps) {
  const headingId = `${id ?? title.toLowerCase().replace(/\W+/g, "-")}-title`;
  return (
    <section
      aria-labelledby={headingId}
      id={id}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading id={headingId} level={level} size="xl">
            {title}
          </Heading>
          {description ? <Text variant="muted">{description}</Text> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
