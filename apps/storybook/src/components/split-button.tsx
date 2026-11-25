import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";

type SplitButtonProps = Readonly<{
  /** The main action: shown as the button label and run on click. */
  children: ReactNode;
  onClick?: ComponentProps<typeof Button>["onClick"];
  /** Accessible name for the arrow that opens the extra actions. */
  menuLabel?: string;
  /** `DropdownMenuItem`s with the extra actions. */
  menu: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  disabled?: boolean;
}>;

/** A main action plus a dropdown with related actions. */
export function SplitButton({
  children,
  onClick,
  menuLabel = "More actions",
  menu,
  variant = "default",
  size,
  disabled,
}: SplitButtonProps) {
  return (
    <ButtonGroup>
      <Button variant={variant} size={size} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={menuLabel}
            className="px-2 border-l border-l-primary-foreground/25"
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
