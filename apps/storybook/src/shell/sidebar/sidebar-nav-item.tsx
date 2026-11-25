import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/badge";
import { useBadgeCount } from "../config/layout-config";
import type { NavLeaf } from "../navigation";
import { navLinkActiveClass, navLinkClass } from "./sidebar-nav-styles";
import { SidebarTooltip } from "./sidebar-tooltip";

export function SidebarNavItem({ item }: Readonly<{ item: NavLeaf }>) {
  const Icon = item.icon;
  const count = useBadgeCount(String(item.to));
  const name = count > 0 ? `${item.label}, ${count} unread` : item.label;
  return (
    <SidebarTooltip label={name}>
      <Link
        to={item.to}
        // The label can be hidden when the sidebar is collapsed, so name the link.
        aria-label={name}
        className={navLinkClass}
        activeProps={{ className: navLinkActiveClass, "aria-current": "page" }}
      >
        <span className="relative shrink-0">
          <Icon className="size-4" aria-hidden="true" />
          {/* When the sidebar is collapsed there is no room for a number, so a dot sits on the icon. */}
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 hidden size-2 rounded-full bg-primary ring-2 ring-sidebar in-data-[sidebar=collapsed]:block"
            />
          )}
        </span>
        <span className="truncate in-data-[sidebar=collapsed]:hidden">{item.label}</span>
        {count > 0 && (
          <Badge className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[0.65rem] tabular-nums in-data-[sidebar=collapsed]:hidden">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
        {item.badge && (
          <Badge
            variant="secondary"
            className="ml-auto px-1.5 py-0 text-[0.65rem] in-data-[sidebar=collapsed]:hidden"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    </SidebarTooltip>
  );
}
