import { Link } from "@tanstack/react-router";
import { Separator } from "../../components/separator";
import { BrandLogo, useLayoutConfig } from "../config/layout-config";
import { NavbarHelp } from "./navbar-help";
import { NavbarNotifications } from "./navbar-notifications";
import { NavbarSearch } from "./navbar-search";
import { NavbarSidebarToggle } from "./navbar-sidebar-toggle";
import { NavbarUserMenu } from "./navbar-user-menu";
import type { NavbarUser } from "./navbar-user-menu";

export function Navbar({
  user,
  onSignOut,
}: Readonly<{ user: NavbarUser; onSignOut?: () => void }>) {
  const { brand } = useLayoutConfig();
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
      {/* The horizontal layout has no sidebar: the logo moves here and the toggle goes. */}
      <Link
        to="/"
        aria-label={`${brand.name}, go to the app`}
        className="hidden shrink-0 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring in-data-[layout=horizontal]:block"
      >
        <BrandLogo className="h-6 w-auto" />
      </Link>
      <div className="in-data-[layout=horizontal]:hidden">
        <NavbarSidebarToggle />
      </div>
      <NavbarSearch />
      <div className="ml-auto flex items-center gap-1">
        <NavbarNotifications />
        <NavbarHelp />
        <Separator orientation="vertical" className="mx-2" />
        <NavbarUserMenu user={user} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
