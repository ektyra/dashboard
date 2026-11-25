import { isNavParent } from "../navigation";
import type { NavGroup } from "../navigation";
import { SidebarGroupLabel } from "./sidebar-group-label";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarNavParent } from "./sidebar-nav-parent";

/** Renders groups of menu items. A group's label is a heading, or a divider when collapsed. */
export function SidebarNav({ groups, label }: Readonly<{ groups: NavGroup[]; label: string }>) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2">
      {groups.map((group, index) => (
        <div key={group.label ?? index}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.label}>
                {isNavParent(item) ? (
                  <SidebarNavParent item={item} />
                ) : (
                  <SidebarNavItem item={item} />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
