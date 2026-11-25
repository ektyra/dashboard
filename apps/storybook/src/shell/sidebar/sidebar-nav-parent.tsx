import { useEffect, useId, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { Tooltip, TooltipTrigger } from "../../components/tooltip";
import { cn } from "../../lib/cn";
import { useSidebarCollapsed } from "../sidebar-state";
import type { NavParent } from "../navigation";
import { navLinkActiveClass, navLinkClass } from "./sidebar-nav-styles";
import { SidebarTooltipContent, useSidebarTooltip } from "./sidebar-tooltip";

/**
 * A menu item with a submenu. It is a button, not a link.
 *
 * - Sidebar expanded: the submenu opens below the item. It opens by itself
 *   while you are on one of its pages.
 * - Sidebar collapsed: only the icon shows, and clicking it opens the submenu
 *   as a dropdown to the right of the item.
 */
export function SidebarNavParent({ item }: Readonly<{ item: NavParent }>) {
  const Icon = item.icon;
  const listId = useId();
  const reduceMotion = useReducedMotion();
  const collapsed = useSidebarCollapsed();
  const tooltip = useSidebarTooltip();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const inSection = item.children.some(
    (child) => pathname === child.to || pathname.startsWith(`${child.to}/`),
  );

  // undefined = follow the route; a boolean = the user chose.
  const [manual, setManual] = useState<boolean | undefined>(undefined);
  useEffect(() => setManual(undefined), [inSection]);
  const open = manual ?? inSection;

  const rowClass = cn(
    navLinkClass,
    "w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    inSection && "text-sidebar-foreground",
    // Collapsed: no submenu is visible, so mark the section you are in.
    inSection && "in-data-[sidebar=collapsed]:bg-sidebar-accent",
  );

  const rowContent = (
    <>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate text-left in-data-[sidebar=collapsed]:hidden">
        {item.label}
      </span>
      <ChevronRight
        className={cn(
          "size-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200 in-data-[sidebar=collapsed]:hidden",
          !collapsed && open && "rotate-90",
        )}
        aria-hidden="true"
      />
    </>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip {...tooltip}>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <button type="button" aria-label={item.label} className={rowClass}>
                {rowContent}
              </button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <SidebarTooltipContent>{item.label}</SidebarTooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start" sideOffset={12} className="min-w-48">
          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
          {item.children.map((child) => (
            <DropdownMenuItem key={child.to} asChild>
              <Link
                to={child.to}
                activeProps={{
                  className: "bg-accent text-accent-foreground",
                  "aria-current": "page",
                }}
              >
                {child.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-label={item.label}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setManual(!open)}
        className={rowClass}
      >
        {rowContent}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={listId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="ml-5 flex flex-col gap-0.5 overflow-hidden border-l border-sidebar-border pl-2"
          >
            {item.children.map((child) => (
              <li key={child.to} className="first:mt-1">
                <Link
                  to={child.to}
                  className="flex h-8 items-center truncate rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  activeProps={{ className: navLinkActiveClass, "aria-current": "page" }}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
