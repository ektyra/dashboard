import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Download,
  Pin,
} from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type GridColumn<T> = {
  key: keyof T & string;
  header: string;
  /** Custom cell. Gets the row. Without it the value is shown as text. */
  cell?: (row: T) => ReactNode;
  /** The value can be edited by double-clicking (or pressing Enter) on the cell. */
  editable?: boolean;
  align?: "left" | "right";
  width?: string;
};

export type GridView = {
  name: string;
  search?: string;
  sort?: { key: string; dir: "asc" | "desc" };
  groupBy?: string;
};

type Density = "compact" | "default" | "relaxed";

type AdvancedDataGridProps<T extends { id: string | number }> = Readonly<{
  rows: T[];
  columns: GridColumn<T>[];
  /** Called when a cell is edited. Return the new rows yourself; the grid keeps no copy. */
  onCellEdit?: (row: T, key: keyof T & string, value: string) => void;
  /** Column keys you can group the rows by. */
  groupable?: (keyof T & string)[];
  /** Saved views: a name, plus a search, sort and grouping. */
  views?: GridView[];
  /** File name for the CSV export. */
  exportName?: string;
}>;

const toCsv = <T,>(rows: T[], columns: GridColumn<T>[]) => {
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [
    columns.map((c) => esc(c.header)).join(","),
    ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")),
  ].join("\n");
};

/**
 * A data grid for power users: pinned first column, search, sorting, grouping with
 * collapsible groups, density, saved views, double-click editing and CSV export of
 * what you currently see.
 */
export function AdvancedDataGrid<T extends { id: string | number }>({
  rows,
  columns,
  onCellEdit,
  groupable = [],
  views = [],
  exportName = "export",
}: AdvancedDataGridProps<T>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | undefined>();
  const [groupBy, setGroupBy] = useState<string | undefined>();
  const [density, setDensity] = useState<Density>("default");
  const [pinFirst, setPinFirst] = useState(true);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{ id: T["id"]; key: string } | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? rows.filter((r) =>
          columns.some((c) =>
            String(r[c.key] ?? "")
              .toLowerCase()
              .includes(q),
          ),
        )
      : rows;
    if (sort) {
      const { key, dir } = sort;
      list = [...list].sort((a, b) => {
        const av = a[key as keyof T];
        const bv = b[key as keyof T];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [rows, columns, search, sort]);

  const groups = useMemo(() => {
    if (!groupBy) return [{ label: undefined as string | undefined, rows: visible }];
    const map = new Map<string, T[]>();
    for (const r of visible) {
      const k = String(r[groupBy as keyof T]);
      map.set(k, [...(map.get(k) ?? []), r]);
    }
    return [...map].map(([label, list]) => ({ label, rows: list }));
  }, [visible, groupBy]);

  const toggleSort = (key: string) =>
    setSort((cur) =>
      cur?.key !== key ? { key, dir: "asc" } : cur.dir === "asc" ? { key, dir: "desc" } : undefined,
    );

  const download = () => {
    const blob = new Blob([toCsv(visible, columns)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `${exportName}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyView = (v: GridView) => {
    setSearch(v.search ?? "");
    setSort(v.sort);
    setGroupBy(v.groupBy);
  };

  const pinned = "sticky left-0 z-10 bg-card shadow-[1px_0_0_var(--border)]";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          aria-label="Search the grid"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
        {views.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Views <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Saved views</DropdownMenuLabel>
              {views.map((v) => (
                <DropdownMenuItem key={v.name} onClick={() => applyView(v)}>
                  {v.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => applyView({ name: "All" })}>Reset</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {groupable.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Group by{groupBy ? `: ${columns.find((c) => c.key === groupBy)?.header}` : ""}{" "}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setGroupBy(undefined)}>No grouping</DropdownMenuItem>
              {groupable.map((k) => (
                <DropdownMenuItem key={k} onClick={() => setGroupBy(k)}>
                  {columns.find((c) => c.key === k)?.header ?? k}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ButtonGroup aria-label="Density">
          {(["compact", "default", "relaxed"] as const).map((d) => (
            <Button
              key={d}
              variant="outline"
              size="sm"
              aria-pressed={density === d}
              className={cn(density === d && "bg-accent")}
              onClick={() => setDensity(d)}
            >
              {d}
            </Button>
          ))}
        </ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={pinFirst}
          className={cn(pinFirst && "bg-accent")}
          onClick={() => setPinFirst((v) => !v)}
        >
          <Pin /> Pin first column
        </Button>
        <Button variant="outline" size="sm" className="ml-auto" onClick={download}>
          <Download /> Export CSV
        </Button>
      </div>

      <Table density={density} wrapperClassName="bg-card max-h-[28rem]">
        <TableHeader className="sticky top-0 z-20 bg-card">
          <TableRow className="hover:bg-transparent">
            {columns.map((c, i) => (
              <TableHead
                key={c.key}
                className={cn(c.align === "right" && "text-right", i === 0 && pinFirst && pinned)}
                style={{ minWidth: c.width }}
                aria-sort={
                  sort?.key === c.key
                    ? sort.dir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <button
                  type="button"
                  onClick={() => toggleSort(c.key)}
                  className="hover:text-foreground focus-visible:ring-ring -ml-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 outline-none focus-visible:ring-2"
                >
                  {c.header}
                  {sort?.key === c.key ? (
                    sort.dir === "asc" ? (
                      <ArrowUp className="size-3.5" />
                    ) : (
                      <ArrowDown className="size-3.5" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3.5 opacity-50" />
                  )}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                No rows match.
              </TableCell>
            </TableRow>
          )}
          {groups.map((g) => {
            const isCollapsed = g.label !== undefined && collapsed.has(g.label);
            return (
              <GroupRows
                key={g.label ?? "all"}
                label={g.label}
                count={g.rows.length}
                columns={columns.length}
                collapsed={isCollapsed}
                onToggle={() =>
                  setCollapsed((cur) => {
                    const n = new Set(cur);
                    if (g.label) {
                      n.has(g.label) ? n.delete(g.label) : n.add(g.label);
                    }
                    return n;
                  })
                }
              >
                {!isCollapsed &&
                  g.rows.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((c, i) => {
                        const isEditing = editing?.id === row.id && editing.key === c.key;
                        return (
                          <TableCell
                            key={c.key}
                            className={cn(
                              c.align === "right" && "text-right tabular-nums",
                              i === 0 && pinFirst && pinned,
                            )}
                            tabIndex={c.editable ? 0 : undefined}
                            onDoubleClick={() =>
                              c.editable && setEditing({ id: row.id, key: c.key })
                            }
                            onKeyDown={(e) => {
                              if (c.editable && e.key === "Enter" && !isEditing)
                                setEditing({ id: row.id, key: c.key });
                            }}
                          >
                            {isEditing ? (
                              <input
                                autoFocus
                                aria-label={`Edit ${c.header}`}
                                defaultValue={String(row[c.key] ?? "")}
                                className="border-primary bg-background focus-visible:ring-ring h-7 w-full rounded border px-2 outline-none focus-visible:ring-2"
                                onBlur={(e) => {
                                  onCellEdit?.(row, c.key, e.target.value);
                                  setEditing(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                  if (e.key === "Escape") setEditing(null);
                                }}
                              />
                            ) : c.cell ? (
                              c.cell(row)
                            ) : (
                              String(row[c.key] ?? "")
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </GroupRows>
            );
          })}
        </TableBody>
      </Table>
      <p className="text-muted-foreground text-xs" aria-live="polite">
        {visible.length} of {rows.length} rows
        {onCellEdit && columns.some((c) => c.editable)
          ? ` · double-click or press Enter on a ${columns
              .filter((c) => c.editable)
              .map((c) => c.header)
              .join(" or ")} cell to edit`
          : ""}
      </p>
    </div>
  );
}

function GroupRows({
  label,
  count,
  columns,
  collapsed,
  onToggle,
  children,
}: Readonly<{
  label?: string;
  count: number;
  columns: number;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}>) {
  return (
    <>
      {label !== undefined && (
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell colSpan={columns} className="py-1.5">
            <button
              type="button"
              aria-expanded={!collapsed}
              onClick={onToggle}
              className="focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded text-sm font-medium outline-none focus-visible:ring-2"
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
              {label} <span className="text-muted-foreground font-normal">({count})</span>
            </button>
          </TableCell>
        </TableRow>
      )}
      {children}
    </>
  );
}
