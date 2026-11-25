import { useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  File as FileIcon,
  FileImage,
  FileText,
  Folder,
  FolderPlus,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "../lib/cn";
import { formatBytes } from "../lib/format";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { ConfirmDialogBase } from "./file-manager-confirm";
import { Input } from "./input";

export type FileEntry = {
  id: string;
  name: string;
  kind: "folder" | "file";
  parent: string | null;
  size?: number;
  modified: string;
  mime?: string;
};

type FileManagerProps = Readonly<{
  entries: FileEntry[];
  onChange: (entries: FileEntry[]) => void;
}>;

const iconFor = (e: FileEntry) =>
  e.kind === "folder"
    ? Folder
    : e.mime?.startsWith("image/")
      ? FileImage
      : e.mime?.startsWith("text/") || e.mime === "application/pdf"
        ? FileText
        : FileIcon;

/**
 * Browse folders, upload, rename and delete. List or grid. Everything works with the keyboard:
 * Enter opens, F2 renames, Delete removes the focused item.
 */
export function FileManager({ entries, onChange }: FileManagerProps) {
  const [folder, setFolder] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "grid">("list");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<FileEntry | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const path = useMemo(() => {
    const trail: FileEntry[] = [];
    let cur = folder;
    while (cur) {
      const f = entries.find((e) => e.id === cur);
      if (!f) break;
      trail.unshift(f);
      cur = f.parent;
    }
    return trail;
  }, [entries, folder]);

  const visible = entries
    .filter((e) => e.parent === folder)
    .sort((a, b) =>
      a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "folder" ? -1 : 1,
    );

  const update = (id: string, patch: Partial<FileEntry>) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => {
    const gone = new Set<string>([id]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const e of entries)
        if (e.parent && gone.has(e.parent) && !gone.has(e.id)) {
          gone.add(e.id);
          grew = true;
        }
    }
    onChange(entries.filter((e) => !gone.has(e.id)));
  };

  const Item = ({ e }: { e: FileEntry }) => {
    const Icon = iconFor(e);
    const open = () => e.kind === "folder" && setFolder(e.id);
    return (
      <div
        role="listitem"
        tabIndex={0}
        onDoubleClick={open}
        onKeyDown={(k) => {
          if (renaming) return;
          if (k.key === "Enter") open();
          if (k.key === "F2") setRenaming(e.id);
          if (k.key === "Delete") setToDelete(e);
        }}
        className={cn(
          "group border-border bg-card hover:bg-muted focus-visible:ring-ring flex items-center gap-3 rounded-lg border p-2.5 outline-none focus-visible:ring-2",
          view === "grid" && "flex-col py-5 text-center",
        )}
      >
        <span
          className={cn(
            "bg-muted text-muted-foreground grid shrink-0 place-items-center rounded-md",
            view === "grid" ? "size-14" : "size-10",
            e.kind === "folder" && "bg-primary/10 text-primary",
          )}
        >
          <Icon className={view === "grid" ? "size-7" : "size-5"} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          {renaming === e.id ? (
            <Input
              autoFocus
              aria-label={`Rename ${e.name}`}
              defaultValue={e.name}
              className="h-7"
              onBlur={(ev) => {
                const v = ev.target.value.trim();
                if (v) update(e.id, { name: v });
                setRenaming(null);
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") (ev.target as HTMLInputElement).blur();
                if (ev.key === "Escape") setRenaming(null);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={open}
              className={cn(
                "max-w-full truncate text-sm outline-none",
                e.kind === "folder" ? "cursor-pointer hover:underline" : "cursor-default",
              )}
            >
              {e.name}
            </button>
          )}
          <p className="text-muted-foreground text-xs">
            {e.kind === "folder"
              ? `${entries.filter((x) => x.parent === e.id).length} items`
              : formatBytes(e.size ?? 0)}{" "}
            · {e.modified}
          </p>
        </div>
        <div
          className={cn(
            "flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
            view === "grid" && "absolute",
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Rename ${e.name}`}
            onClick={() => setRenaming(e.id)}
          >
            <Pencil />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Delete ${e.name}`}
            onClick={() => setToDelete(e)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <nav
          aria-label="Folder path"
          className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-sm"
        >
          <button
            type="button"
            onClick={() => setFolder(null)}
            className="hover:text-primary rounded px-1 font-medium"
          >
            Files
          </button>
          {path.map((p) => (
            <span key={p.id} className="flex items-center gap-1">
              <ChevronRight className="text-muted-foreground size-4" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setFolder(p.id)}
                className="hover:text-primary rounded px-1"
              >
                {p.name}
              </button>
            </span>
          ))}
        </nav>
        <ButtonGroup aria-label="View">
          <Button
            variant="outline"
            size="icon"
            aria-label="List view"
            aria-pressed={view === "list"}
            className={cn(view === "list" && "bg-accent")}
            onClick={() => setView("list")}
          >
            <List />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={cn(view === "grid" && "bg-accent")}
            onClick={() => setView("grid")}
          >
            <LayoutGrid />
          </Button>
        </ButtonGroup>
        <Button
          variant="outline"
          onClick={() => {
            const id = `f-${Date.now()}`;
            onChange([
              ...entries,
              { id, name: "New folder", kind: "folder", parent: folder, modified: "Just now" },
            ]);
            setRenaming(id);
          }}
        >
          <FolderPlus /> New folder
        </Button>
        <Button onClick={() => fileInput.current?.click()}>
          <Upload /> Upload
        </Button>
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          onChange={(ev) => {
            const files = [...(ev.target.files ?? [])];
            onChange([
              ...entries,
              ...files.map((f, i) => ({
                id: `u-${Date.now()}-${i}`,
                name: f.name,
                kind: "file" as const,
                parent: folder,
                size: f.size,
                mime: f.type,
                modified: "Just now",
              })),
            ]);
            ev.target.value = "";
          }}
        />
      </div>

      {visible.length === 0 ? (
        <div className="border-border text-muted-foreground grid h-40 place-items-center rounded-xl border border-dashed text-sm">
          This folder is empty. Upload a file or create a folder.
        </div>
      ) : (
        <div
          role="list"
          aria-label="Files and folders"
          className={cn(
            "relative grid gap-2",
            view === "grid" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {visible.map((e) => (
            <Item key={e.id} e={e} />
          ))}
        </div>
      )}

      <ConfirmDialogBase
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete “${toDelete?.name ?? ""}”?`}
        description={
          toDelete?.kind === "folder"
            ? "The folder and everything inside it will be removed. This cannot be undone."
            : "The file will be removed. This cannot be undone."
        }
        confirmLabel={toDelete?.kind === "folder" ? "Delete folder" : "Delete file"}
        onConfirm={() => {
          if (toDelete) remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
