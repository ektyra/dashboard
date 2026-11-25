import type { ReactNode } from "react";
import { sampleConfig } from "../navigation/sample-config";
import { LayoutProvider } from "../shell/config/layout-config";
import { HorizontalMenu } from "../shell/horizontal-menu/horizontal-menu";
import { Navbar } from "../shell/navbar/navbar";
import { Sidebar } from "../shell/sidebar/sidebar";

const user = { name: "Ada Lovelace", email: "ada@example.com" };

export type AppLayout = "vertical" | "horizontal" | "detached";

/**
 * The page shell the templates sit in. Three arrangements, like the real app:
 * - vertical: sidebar on the left, navbar on top (default)
 * - horizontal: no sidebar; the menu runs under the navbar
 * - detached: the sidebar floats as a rounded card on a tinted background
 */
export function AppFrame({
  children,
  layout = "vertical",
}: Readonly<{ children: ReactNode; layout?: AppLayout }>) {
  return (
    <LayoutProvider config={sampleConfig}>
      <div
        className={
          layout === "detached"
            ? "bg-muted/50 text-foreground flex min-h-dvh"
            : "bg-background text-foreground flex min-h-dvh"
        }
        data-layout={layout}
      >
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar user={user} onSignOut={() => {}} />
          {layout === "horizontal" && <HorizontalMenu />}
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </LayoutProvider>
  );
}
