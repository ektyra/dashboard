import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type IconButtonProps = ComponentProps<"button"> & {
  /** Required: an icon-only button has no visible text. Shown as the tooltip. */
  label: string;
  /** A keyboard shortcut shown in the tooltip, for example "⌘B". */
  shortcut?: string;
};

export function IconButton({
  label,
  shortcut,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type={type}
          aria-label={label}
          className={cn(
            "relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-[1.15rem]",
            className,
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && (
          <Kbd className="h-4 min-w-4 border-background/30 bg-background/10 px-1 text-background/80">
            {shortcut}
          </Kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
