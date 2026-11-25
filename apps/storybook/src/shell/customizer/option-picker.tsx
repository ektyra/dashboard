import type { ReactNode } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export type PickerOption<T extends string> = {
  value: T;
  label: string;
  /** A picture of the choice, shown above the label. */
  preview: ReactNode;
};

/** A titled group of picture cards where exactly one is chosen. */
export function OptionPicker<T extends string>({
  label,
  description,
  value,
  onValueChange,
  options,
  columns = 2,
  disabled,
}: Readonly<{
  label: string;
  description?: string;
  value: T;
  onValueChange: (value: T) => void;
  options: readonly PickerOption<T>[];
  columns?: 2 | 3;
  disabled?: boolean;
}>) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-2.5 text-sm font-medium">{label}</legend>
      {description && <p className="-mt-1.5 text-xs text-muted-foreground">{description}</p>}
      <RadioGroupPrimitive.Root
        aria-label={label}
        value={value}
        disabled={disabled}
        onValueChange={(next) => onValueChange(next as T)}
        className={cn("grid gap-2.5", columns === 3 ? "grid-cols-3" : "grid-cols-2")}
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            className="group grid cursor-pointer content-start gap-2 rounded-lg border border-input bg-card p-2 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:ring-1 data-[state=checked]:ring-primary"
          >
            {option.preview}
            <span className="flex items-center justify-between gap-1 px-0.5 text-xs">
              {option.label}
              <Check
                aria-hidden="true"
                strokeWidth={3}
                className="size-3 text-primary opacity-0 group-data-[state=checked]:opacity-100"
              />
            </span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
}
