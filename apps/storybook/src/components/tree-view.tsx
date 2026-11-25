import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "../lib/cn";

export type TreeNode = {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
};

type TreeViewProps = Readonly<{
  nodes: TreeNode[];
  /** Ids of the folders that start open. */
  defaultExpanded?: string[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
}>;

export function TreeView({
  nodes,
  defaultExpanded = [],
  selectedId,
  onSelect,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded));

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderNodes = (list: TreeNode[], level: number): ReactNode => (
    <ul role={level === 0 ? "tree" : "group"} className="flex flex-col gap-0.5">
      {list.map((node) => {
        const isFolder = Boolean(node.children);
        const open = expanded.has(node.id);
        return (
          <li
            key={node.id}
            role="treeitem"
            aria-expanded={isFolder ? open : undefined}
            aria-selected={node.id === selectedId}
          >
            <button
              type="button"
              onClick={() => {
                if (isFolder) toggle(node.id);
                onSelect?.(node);
              }}
              style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                node.id === selectedId && "bg-accent text-accent-foreground hover:bg-accent",
              )}
            >
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-90",
                  !isFolder && "invisible",
                )}
              />
              <span className="shrink-0 text-muted-foreground [&_svg]:size-4">
                {node.icon ??
                  (isFolder ? (
                    open ? (
                      <FolderOpen aria-hidden="true" />
                    ) : (
                      <Folder aria-hidden="true" />
                    )
                  ) : (
                    <File aria-hidden="true" />
                  ))}
              </span>
              <span className="truncate">{node.label}</span>
            </button>
            {isFolder && open && node.children && renderNodes(node.children, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return <div className={className}>{renderNodes(nodes, 0)}</div>;
}
