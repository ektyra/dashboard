import { createContext, use, useState, type ReactNode } from "react";
import type { Decorator } from "@storybook/react-vite";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { Tooltip } from "radix-ui";

const StoryContext = createContext<ReactNode>(null);

function Root() {
  const story = use(StoryContext);
  return <Tooltip.Provider delayDuration={200}>{story}</Tooltip.Provider>;
}

function Shell({ children, initialPath }: { children: ReactNode; initialPath: string }) {
  // One router per story mount, so router state survives re-renders.
  const [router] = useState(() =>
    createRouter({
      routeTree: createRootRoute({ component: Root }),
      history: createMemoryHistory({ initialEntries: [initialPath] }),
    }),
  );
  return (
    <StoryContext value={children}>
      <RouterProvider router={router} />
    </StoryContext>
  );
}

/** Wraps every story in a memory router, a tooltip provider and the toaster. */
export const withProviders: Decorator = (Story, context) => (
  <Shell initialPath={(context.parameters.initialPath as string | undefined) ?? "/"}>
    <Story />
  </Shell>
);
