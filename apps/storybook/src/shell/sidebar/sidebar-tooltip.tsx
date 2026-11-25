import { useState } from "react";
import type { ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/tooltip";
import { useSidebarCollapsed } from "../sidebar-state";

/**
 * Open state for a sidebar tooltip, which only ever shows while the sidebar is
 * collapsed. When it is expanded the label is already visible, so a tooltip
 * would only repeat it. Spread the result on a `Tooltip`.
 */
export function useSidebarTooltip() {
  const collapsed = useSidebarCollapsed();
  const [open, setOpen] = useState(false);
  return { open: open && collapsed, onOpenChange: setOpen };
}

/** Tooltip content for a sidebar item: to the right, a little away from the icon. */
export function SidebarTooltipContent({ children }: Readonly<{ children: string }>) {
  return (
    <TooltipContent side="right" sideOffset={14}>
      {children}
    </TooltipContent>
  );
}

/** Wraps a single element (a link or button that accepts a ref and props). */
export function SidebarTooltip({
  label,
  children,
}: Readonly<{ label: string; children: ReactElement }>) {
  const state = useSidebarTooltip();
  return (
    <Tooltip {...state}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <SidebarTooltipContent>{label}</SidebarTooltipContent>
    </Tooltip>
  );
}
