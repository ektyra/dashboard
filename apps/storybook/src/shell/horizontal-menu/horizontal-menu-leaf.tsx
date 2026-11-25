import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/badge";
import { DropdownMenuItem } from "../../components/dropdown-menu";
import { useBadgeCount } from "../config/layout-config";
import type { NavLeaf } from "../navigation";

/** A page in a dropdown, with the same unread count as in the sidebar. */
export function HorizontalMenuLeaf({ item }: Readonly<{ item: NavLeaf }>) {
  const count = useBadgeCount(String(item.to));
  const Icon = item.icon;
  return (
    <DropdownMenuItem asChild>
      <Link to={item.to}>
        <Icon aria-hidden="true" />
        {item.label}
        {count > 0 && (
          <Badge className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[0.65rem]">
            {count}
          </Badge>
        )}
        {item.badge && (
          <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[0.65rem]">
            {item.badge}
          </Badge>
        )}
      </Link>
    </DropdownMenuItem>
  );
}
