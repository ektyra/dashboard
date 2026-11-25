import type { LucideIcon } from "lucide-react";
import { isNavParent } from "./types";
import type { ExtraPage, NavGroup, NavTo, SearchablePage } from "./types";

export type TrailEntry = {
  /** Menu headings above the page, such as "Apps & pages" and "Form elements". They are not pages. */
  parents: string[];
  label: string;
  to: NavTo;
  /** The menu icon of the page (or of its submenu), used for the icon tile in the page header. */
  icon: LucideIcon;
};

type NavigationSource = Readonly<{
  main: NavGroup[];
  footer: NavGroup[];
  extraPages?: ExtraPage[];
}>;

/** Every page in the menu with the headings above it. Built on each call, so labels follow the language. */
export const getTrailEntries = ({
  main,
  footer,
  extraPages = [],
}: NavigationSource): TrailEntry[] => [
  ...[...main, ...footer].flatMap((group) =>
    group.items.flatMap((item): TrailEntry[] => {
      const above = group.label ? [group.label] : [];
      return isNavParent(item)
        ? item.children.map((child) => ({
            parents: [...above, item.label],
            label: child.label,
            to: child.to,
            icon: item.icon,
          }))
        : [{ parents: above, label: item.label, to: item.to, icon: item.icon }];
    }),
  ),
  ...extraPages.map(({ label, to, icon, group }) => ({
    parents: group ? [group] : [],
    label,
    to,
    icon,
  })),
];

/**
 * The menu entry that owns a path. `/apps/users/u2` belongs to `/apps/users`:
 * the longest entry whose path is the start of the current one wins.
 */
export function findTrailEntry(
  navigation: NavigationSource,
  pathname: string,
): TrailEntry | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return getTrailEntries(navigation)
    .filter((entry) => {
      const to = String(entry.to);
      return clean === to || clean.startsWith(`${to}/`);
    })
    .sort((a, b) => String(b.to).length - String(a.to).length)[0];
}

/** Every page, submenus included, for the search dialog. */
export const getSearchablePages = ({
  main,
  footer,
  extraPages = [],
}: NavigationSource): SearchablePage[] => [
  ...[...main, ...footer].flatMap((group) =>
    group.items.flatMap((item): SearchablePage[] =>
      isNavParent(item)
        ? item.children.map((child) => ({ ...child, icon: item.icon, group: item.label }))
        : [{ label: item.label, to: item.to, icon: item.icon }],
    ),
  ),
  ...extraPages,
];
