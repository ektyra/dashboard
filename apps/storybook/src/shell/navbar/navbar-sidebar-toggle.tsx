import { useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconButton } from "../../components/icon-button";
import { toggleSidebar, useSidebarCollapsed } from "../sidebar-state";

export function NavbarSidebarToggle() {
  const collapsed = useSidebarCollapsed();

  // Cmd+B on macOS, Ctrl+B elsewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <IconButton
      label="Toggle sidebar"
      shortcut="⌘B"
      aria-expanded={!collapsed}
      onClick={toggleSidebar}
    >
      {/* The icon follows the `data-sidebar` attribute (set before first
          paint), so it never flashes the wrong one on reload. */}
      <PanelLeftClose className="in-data-[sidebar=collapsed]:hidden" aria-hidden="true" />
      <PanelLeftOpen className="hidden in-data-[sidebar=collapsed]:block" aria-hidden="true" />
    </IconButton>
  );
}
