import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "../config/layout-config";
import { AuthShowcasePanel } from "./auth-showcase-panel";
import { AuthThemeToggle } from "./auth-theme-toggle";
import { AuthUsps } from "./auth-usps";

/**
 * The layout for sign-in style pages: no sidebar, no navbar. A split screen where
 * the form side is the narrower one and the picture side runs the full height of
 * the page (it hides on small screens). Pages put their content in `{children}`;
 * the three selling points sit under it on every auth page.
 */
export function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(36rem,5fr)_7fr]">
      <div className="flex min-h-dvh flex-col px-6 py-8 sm:px-12 lg:px-12">
        <header className="mx-auto flex w-full max-w-lg items-center justify-between">
          <Link to="/" aria-label="Ektyra, go to the app">
            <BrandLogo className="h-8 w-auto" />
          </Link>
          <AuthThemeToggle />
        </header>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-10 py-10">
          <main className="flex min-w-0 flex-col gap-8">{children}</main>
          <AuthUsps />
        </div>
        <footer className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 Ektyra</span>
          <Link to="/" className="transition-colors hover:text-foreground">
            Back to the app
          </Link>
        </footer>
      </div>
      <AuthShowcasePanel />
    </div>
  );
}
