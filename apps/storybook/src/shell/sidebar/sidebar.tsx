import { Link } from "@tanstack/react-router";
import { useAutohideScrollbar } from "../../lib/use-autohide-scrollbar";
import { BrandLogo, useLayoutConfig } from "../config/layout-config";
import { SidebarNav } from "./sidebar-nav";
import { SidebarProjectSwitcher } from "./sidebar-project-switcher";
import type { Project } from "./sidebar-project-switcher";

// No project feature yet. When projects exist, pass them in from the layout.
const NO_PROJECTS: Project[] = [];

/**
 * The width comes from `--sidebar-width` and the collapsed look from
 * `<html data-sidebar="collapsed">`. Both are set by `sidebar-state`.
 */
export function Sidebar({
  projects = NO_PROJECTS,
  activeProjectId,
  onProjectChange,
  projectLabel,
  projectMenuLabel,
}: Readonly<{
  projects?: Project[];
  activeProjectId?: string;
  onProjectChange?: (id: string) => void;
  projectLabel?: string;
  projectMenuLabel?: string;
}>) {
  const { brand, navigation } = useLayoutConfig();
  const scrollRef = useAutohideScrollbar();
  return (
    <aside className="sticky top-0 flex h-dvh w-(--sidebar-width) in-data-[layout=horizontal]:hidden shrink-0 flex-col gap-4 overflow-hidden border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground in-data-[layout=detached]:top-3 in-data-[layout=detached]:m-3 in-data-[layout=detached]:h-[calc(100dvh-1.5rem)] in-data-[layout=detached]:rounded-xl in-data-[layout=detached]:border in-data-[layout=detached]:shadow-sm">
      <Link
        to="/"
        aria-label={`${brand.name}, go to the app`}
        className="flex h-9 shrink-0 items-center rounded-md px-3 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        {/*
          One logo, never swapped or scaled. The box around it narrows with the
          sidebar and clips the wordmark from the right, so "Ektyra" ends as
          just its "E" (the first letter). 4.9rem is the full wordmark at this
          height, 1.1rem is the E alone.
        */}
        <span
          className="block overflow-hidden"
          style={{ width: "clamp(1.1rem, calc(var(--sidebar-width) - 3rem), 4.9rem)" }}
        >
          <BrandLogo className="h-6 w-auto max-w-none" />
        </span>
      </Link>

      <SidebarProjectSwitcher
        projects={projects}
        activeId={activeProjectId}
        onSelect={onProjectChange}
        label={projectLabel}
        menuLabel={projectMenuLabel}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* Scrolls when the menu is taller than the screen; the footer stays put. The
            box reaches the sidebar's right edge so the scrollbar sits flush there,
            while the padding keeps the items aligned with the rest. */}
        <div
          ref={scrollRef}
          className="scrollbar-primary scrollbar-autohide -mr-3 -ml-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 pl-1 in-data-[sidebar=collapsed]:scrollbar-hidden in-data-[sidebar=collapsed]:pr-3"
        >
          <SidebarNav groups={navigation.main} label="Main" />
        </div>
        <SidebarNav groups={navigation.footer} label="Secondary" />
      </div>
    </aside>
  );
}
