import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
} from "lucide-react";
import type { Column, RowData, Table as CoreTable } from "@tanstack/react-table";
import type { ReactTable } from "@tanstack/react-table";
import type { DataTableFeatures } from "../table/features";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

/** A table instance made with the app's standard features (see core/table/features). */
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

type DataTableProps<TData extends RowData> = Readonly<{
  table: DataTableInstance<TData>;
  /** Shown when no row matches. */
  emptyMessage?: string;
  /** Show skeleton rows instead of data. */
  loading?: boolean;
  className?: string;
}>;

export function DataTable<TData extends RowData>({
  table,
  emptyMessage = "No results.",
  loading = false,
  className,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                aria-sort={ariaSort(header.column.getIsSorted())}
              >
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 6 }, (_, row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {Array.from({ length: columnCount }, (_, cell) => (
                <TableCell key={cell}>
                  <Skeleton className="h-4 w-full max-w-40" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="h-32 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
              className="data-[state=selected]:bg-primary/5"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

const ariaSort = (sorted: false | "asc" | "desc") =>
  sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined;

/** A column title that sorts when clicked: ascending, then descending, then off. */
export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: Readonly<{
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  className?: string;
}>) {
  if (!column.getCanSort()) return <span className={className}>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "-ml-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        sorted && "text-foreground",
        className,
      )}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDown className="size-3.5 opacity-50" aria-hidden="true" />
      )}
    </button>
  );
}

/** A checkbox for the header cell: selects or clears every row on the page. */
export function DataTableSelectAll<TData extends RowData>({
  table,
}: Readonly<{ table: CoreTable<DataTableFeatures, TData> }>) {
  const all = table.getIsAllPageRowsSelected();
  const some = table.getIsSomePageRowsSelected();
  return (
    <Checkbox
      aria-label="Select all rows on this page"
      checked={all ? true : some ? "indeterminate" : false}
      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
    />
  );
}

/** Choose which columns are shown. */
export function DataTableViewOptions<TData extends RowData>({
  table,
}: Readonly<{ table: DataTableInstance<TData> }>) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3 aria-hidden="true" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked)}
            onSelect={(event) => event.preventDefault()}
            className="capitalize"
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const pageSizes = [5, 10, 20, 50];

/** Rows per page, the current range, and first / previous / next / last buttons. */
export function DataTablePagination<TData extends RowData>({
  table,
  totalRows,
}: Readonly<{ table: DataTableInstance<TData>; totalRows: number }>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(totalRows, (pageIndex + 1) * pageSize);
  const pageCount = Math.max(1, table.getPageCount());
  const selected = Object.keys(table.state.rowSelection).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <p className="text-muted-foreground" aria-live="polite">
        {selected > 0 ? `${selected} selected. ` : ""}
        {from}–{to} of {totalRows}
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger aria-label="Rows per page" className="h-8 w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-muted-foreground">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="First page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <ChevronsLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Last page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            <ChevronsRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
