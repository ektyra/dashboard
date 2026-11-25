import { cn } from "../../lib/cn";
import type { Layout } from "../appearance";

const bar = "rounded-sm bg-foreground/15";

/**
 * A little drawing of the app shell: sidebar or menu bar, and content blocks. Decorative.
 * `boxed` keeps the content in a column; `iconOnly` narrows the sidebar to icons.
 */
export function LayoutWireframe({
  layout = "vertical",
  boxed = false,
  iconOnly = false,
  className,
}: Readonly<{ layout?: Layout; boxed?: boolean; iconOnly?: boolean; className?: string }>) {
  const horizontal = layout === "horizontal";
  const detached = layout === "detached";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-background",
        detached && "gap-1 bg-muted p-1",
        className,
      )}
    >
      {!horizontal && (
        <div
          className={cn(
            "flex shrink-0 flex-col gap-1.5 border-r border-border bg-sidebar p-1.5",
            detached && "rounded-md border",
            iconOnly ? "w-[12%] items-center" : "w-[24%]",
          )}
        >
          <div className={cn("h-1.5 rounded-sm bg-primary", iconOnly ? "w-2" : "w-2/3")} />
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-1">
              <div
                className={cn(
                  "size-1.5 shrink-0 rounded-sm",
                  row === 1 ? "bg-primary" : "bg-foreground/25",
                )}
              />
              {!iconOnly && (
                <div className={cn("h-1 flex-1 rounded-sm", row === 1 ? "bg-primary/40" : bar)} />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[14%] shrink-0 items-center gap-1.5 border-b border-border px-1.5">
          {horizontal && <div className="h-1.5 w-4 rounded-sm bg-primary" />}
          <div className="h-1.5 w-1/4 rounded-sm bg-foreground/10" />
          <div className="ml-auto size-1.5 rounded-full bg-primary/60" />
        </div>
        {horizontal && (
          <div className="flex h-[12%] shrink-0 items-center gap-2 border-b border-border px-1.5">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={cn("h-1 w-5 rounded-sm", item === 1 ? "bg-primary/50" : bar)}
              />
            ))}
          </div>
        )}
        <div className="min-h-0 flex-1 bg-muted/40 p-1.5">
          <div
            className={cn(
              "grid h-full grid-cols-3 content-start gap-1",
              boxed && "mx-auto w-[66%]",
            )}
          >
            <div className="col-span-3 h-1.5 w-1/3 rounded-sm bg-foreground/20" />
            <div className="h-6 rounded-sm border border-border bg-card" />
            <div className="h-6 rounded-sm border border-border bg-card" />
            <div className="h-6 rounded-sm border border-border bg-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
