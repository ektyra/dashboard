import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export type Step = { title: string; description?: string };

type StepperProps = Readonly<{
  steps: Step[];
  /** Zero-based index of the current step. */
  current: number;
  /** Makes finished steps clickable, to go back. */
  onStepClick?: (index: number) => void;
  /** `vertical` stacks the steps, for a wizard with the steps beside the form. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}>;

/** A horizontal progress indicator for multi-step forms (wizards). */
export function Stepper({
  steps,
  current,
  onStepClick,
  orientation = "horizontal",
  className,
}: StepperProps) {
  const vertical = orientation === "vertical";
  return (
    <ol className={cn(vertical ? "flex flex-col" : "flex items-start", className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const clickable = done && onStepClick;
        const marker = (
          <>
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full border text-sm transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary ring-4 ring-primary/15",
                !done && !active && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0 text-left">
              <span
                className={cn(
                  "block truncate text-sm",
                  !active && !done && "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="block truncate text-xs text-muted-foreground">
                  {step.description}
                </span>
              )}
            </span>
          </>
        );

        return (
          <li
            key={step.title}
            aria-current={active ? "step" : undefined}
            className={cn(
              vertical ? "flex flex-col" : "flex items-center gap-3",
              !vertical && index < steps.length - 1 && "flex-1",
            )}
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="flex cursor-pointer items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {marker}
              </button>
            ) : (
              <div className="flex items-center gap-3">{marker}</div>
            )}
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "bg-border",
                  vertical ? "my-1 ml-4 h-6 w-px" : "mx-2 h-px min-w-6 flex-1",
                  done && "bg-primary",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
