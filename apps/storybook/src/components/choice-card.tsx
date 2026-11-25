import type { ComponentProps, ReactNode } from "react";
import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

type CardContentProps = Readonly<{
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Something on the right, such as a price. */
  aside?: ReactNode;
}>;

const cardClass =
  "group relative flex w-full cursor-pointer items-start gap-3 rounded-xl border border-input bg-card p-4 text-left text-card-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:ring-1 data-[state=checked]:ring-primary";

function CardBody({ title, description, icon, aside }: CardContentProps) {
  return (
    <>
      {icon && (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-data-[state=checked]:bg-primary/15 group-data-[state=checked]:text-primary [&_svg]:size-5">
          {icon}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="text-sm">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
      {aside && <span className="shrink-0 text-sm">{aside}</span>}
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded-full border border-input text-primary-foreground transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary"
      >
        <Check
          className="size-3 opacity-0 group-data-[state=checked]:opacity-100"
          strokeWidth={3}
        />
      </span>
    </>
  );
}

/** A choice shown as a card. Put several inside a `RadioGroup`. */
export function RadioCard({
  className,
  title,
  description,
  icon,
  aside,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & CardContentProps) {
  return (
    <RadioGroupPrimitive.Item className={cn(cardClass, className)} {...props}>
      <CardBody title={title} description={description} icon={icon} aside={aside} />
    </RadioGroupPrimitive.Item>
  );
}

/** A yes or no choice shown as a card. */
export function CheckboxCard({
  className,
  title,
  description,
  icon,
  aside,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & CardContentProps) {
  return (
    <CheckboxPrimitive.Root className={cn(cardClass, className)} {...props}>
      <CardBody title={title} description={description} icon={icon} aside={aside} />
    </CheckboxPrimitive.Root>
  );
}
