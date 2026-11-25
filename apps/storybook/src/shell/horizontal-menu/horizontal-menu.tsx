import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { cn } from "../../lib/cn";
import { useLayoutConfig } from "../config/layout-config";
import { isNavParent } from "../navigation";
import type { NavGroup, NavItem, NavLeaf } from "../navigation";
import { HorizontalMenuLeaf } from "./horizontal-menu-leaf";

/** The pages under a top-level entry, for marking it as the current section. */
const pathsOf = (items: NavItem[]) =>
  items.flatMap((item) =>
    isNavParent(item) ? item.children.map((child) => String(child.to)) : [String(item.to)],
  );

type Section = { label: string; items: NavItem[]; icon?: NavLeaf["icon"] };

/**
 * One top-level entry per menu section: the labelled groups ("Apps & pages", "Components")
 * and each unlabelled parent ("Dashboards"). Each opens a dropdown, and parents
 * inside open a sub-menu to the side.
 */
function sectionsOf(groups: NavGroup[]): Section[] {
  return groups.flatMap((group): Section[] => {
    if (group.label) return [{ label: group.label, items: group.items }];
    return group.items.map((item) => ({
      label: item.label,
      items: isNavParent(item)
        ? item.children.map((child) => ({ label: child.label, icon: item.icon, to: child.to }))
        : [item],
      icon: item.icon,
    }));
  });
}

const triggerClass =
  "flex h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground";

/** The menu bar used by the horizontal layout. It replaces the sidebar. */
export function HorizontalMenu() {
  const { navigation } = useLayoutConfig();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const sections = sectionsOf([...navigation.main, ...navigation.footer]);

  return (
    <nav aria-label="Main" className="border-b border-border bg-background/90 px-4 backdrop-blur">
      <ul className="flex items-center gap-1 overflow-x-auto py-1.5">
        {sections.map((section) => {
          const current = pathsOf(section.items).some(
            (path) => pathname === path || pathname.startsWith(`${path}/`),
          );
          return (
            <li key={section.label} className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-current={current ? "true" : undefined}
                    className={cn(
                      triggerClass,
                      current &&
                        "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {section.label}
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {section.items.map((item) =>
                    isNavParent(item) ? (
                      <DropdownMenuSub key={item.label}>
                        <DropdownMenuSubTrigger>
                          <item.icon aria-hidden="true" />
                          {item.label}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {item.children.map((child) => (
                            <DropdownMenuItem key={String(child.to)} asChild>
                              <Link to={child.to}>{child.label}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ) : (
                      <HorizontalMenuLeaf key={item.label} item={item} />
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
