import type { ReactNode } from "react";
import { sampleConfig } from "../navigation/sample-config";
import { LayoutProvider } from "../shell/config/layout-config";
import { Navbar } from "../shell/navbar/navbar";
import { Sidebar } from "../shell/sidebar/sidebar";

const user = { name: "Ada Lovelace", email: "ada@example.com" };

/**
 * The page shell the templates sit in: sidebar, navbar and a scrolling content area.
 * Mirrors the real app layout (vertical).
 */
export function AppFrame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LayoutProvider config={sampleConfig}>
      <div className="bg-background text-foreground flex min-h-dvh" data-layout="vertical">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar user={user} onSignOut={() => {}} />
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </LayoutProvider>
  );
}
