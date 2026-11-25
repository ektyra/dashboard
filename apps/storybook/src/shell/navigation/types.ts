import type { LucideIcon } from "lucide-react";
import type { LinkProps } from "@tanstack/react-router";

export type NavTo = NonNullable<LinkProps["to"]>;

export type NavChild = { label: string; to: NavTo };

/** A menu item that is a page. */
export type NavLeaf = {
  label: string;
  icon: LucideIcon;
  to: NavTo;
  /** A small tag next to the label, for example "Soon". */
  badge?: string;
};

/** A menu item that opens a submenu. It is not a page itself. */
export type NavParent = {
  label: string;
  icon: LucideIcon;
  children: NavChild[];
};

export type NavItem = NavLeaf | NavParent;

export const isNavParent = (item: NavItem): item is NavParent => "children" in item;

/**
 * A block of menu items. A group with a `label` shows it as a small uppercase
 * heading; when the sidebar is collapsed the heading turns into a divider.
 */
export type NavGroup = {
  label?: string;
  items: NavItem[];
};

/** A page that has no menu item of its own but is still a page worth finding in search and breadcrumbs. */
export type ExtraPage = {
  label: string;
  to: NavTo;
  icon: LucideIcon;
  /** The heading above the page, such as "Components". */
  group?: string;
};

export type SearchablePage = {
  label: string;
  to: NavTo;
  icon: LucideIcon;
  /** The parent menu item, shown next to the label. */
  group?: string;
};
