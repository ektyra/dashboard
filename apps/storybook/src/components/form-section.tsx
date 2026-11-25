import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

type FormSectionProps = Readonly<{
  title: string;
  description?: string;
  /** Draws a line above the section. Use it between sections, not before the first. */
  separator?: boolean;
  children: ReactNode;
  className?: string;
}>;

/** A titled group of fields. With `separator`, a line divides it from the section above. */
export function FormSection({
  title,
  description,
  separator,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn(separator && "border-t border-border pt-8", className)}>
      <header className="mb-6">
        <h3 className="text-base tracking-tight">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}

type CollapsibleFormSectionProps = Readonly<{
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}>;

/** A form section that opens and closes. Good for rarely used options. */
export function CollapsibleFormSection({
  title,
  description,
  defaultOpen = false,
  children,
}: CollapsibleFormSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="rounded-xl border border-border">
      <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl p-4 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid gap-0.5">
          <span className="text-sm">{title}</span>
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid gap-6 border-t border-border p-4 pt-6">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
