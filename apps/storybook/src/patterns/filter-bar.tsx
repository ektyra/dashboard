import type { ReactNode } from "react";
import { Button } from "../components/button";
import { SearchBar } from "./search-bar";

type FilterBarProps = Readonly<{
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** The filter controls: Selects, DatePickers, Chips. */
  children?: ReactNode;
  /** How many filters (including search) are active. Shows "Clear" when above 0. */
  activeCount: number;
  onClear: () => void;
  /** "24 results". Announced politely to screen readers. */
  resultLabel?: string;
  /** Buttons on the far right, e.g. Export. */
  actions?: ReactNode;
}>;

/** Search, filters, a clear-all button and a result count: the top of a list page. */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  children,
  activeCount,
  onClear,
  resultLabel,
  actions,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
        {children}
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters ({activeCount})
          </Button>
        )}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
      {resultLabel && (
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {resultLabel}
        </p>
      )}
    </div>
  );
}
