/**
 * A group heading in capitals. When the sidebar is collapsed the text goes and a
 * divider takes its place, in a row of the same height so nothing below moves.
 */
export function SidebarGroupLabel({ children }: Readonly<{ children: string }>) {
  return (
    <div className="flex h-8 items-center px-3 in-data-[sidebar=collapsed]:px-2">
      <span className="truncate text-[0.7rem] tracking-wider text-sidebar-foreground/50 uppercase in-data-[sidebar=collapsed]:hidden">
        {children}
      </span>
      <div
        aria-hidden="true"
        className="hidden h-px flex-1 bg-sidebar-border in-data-[sidebar=collapsed]:block"
      />
    </div>
  );
}
