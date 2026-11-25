import { Suspense } from "react";
import type { ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

type MapFrameProps = Readonly<{
  /** Height in pixels. */
  height?: number;
  className?: string;
  /** A lazily loaded map component (see `lazy()` in the map demos). */
  children: ReactNode;
}>;

/** The rounded box around a map. It shows a placeholder until the map code has loaded in the browser. */
export function MapFrame({ height = 380, className, children }: MapFrameProps) {
  const placeholder = <Skeleton className="size-full rounded-none" />;
  return (
    <div
      style={{ height }}
      className={cn("overflow-hidden rounded-xl border border-border", className)}
    >
      <ClientOnly fallback={placeholder}>
        <Suspense fallback={placeholder}>{children}</Suspense>
      </ClientOnly>
    </div>
  );
}
