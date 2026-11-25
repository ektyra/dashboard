import { Fragment } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { useLayoutConfig } from "./config/layout-config";
import { findTrailEntry } from "./navigation";

/** The menu entry for the page being shown, if it has one. */
export function useTrailEntry() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { navigation } = useLayoutConfig();
  return findTrailEntry(navigation, pathname);
}

/**
 * Where you are: Home, the menu headings above the page, then the page. Worked out
 * from the menu and the current address, so every page gets it without extra code.
 * Pass `current` on a detail page (a user, an entry): the menu page becomes a link
 * and `current` is the last, unlinked crumb.
 */
export function PageBreadcrumbs({ current }: Readonly<{ current?: string }>) {
  const entry = useTrailEntry();
  if (!entry) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" aria-label="Home">
              <Home className="size-3.5" aria-hidden="true" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {entry.parents.map((label) => (
          <Fragment key={label}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{label}</BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {current ? (
            <BreadcrumbLink asChild>
              <Link to={entry.to}>{entry.label}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{entry.label}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {current && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
