/**
 * Shared by menu items and submenu parents. The fixed height (h-9) matters: it
 * keeps every row the same height whether the label is shown or hidden, so the
 * icons do not move when the sidebar collapses.
 */
export const navLinkClass =
  "flex h-9 items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground";

export const navLinkActiveClass =
  "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent";
