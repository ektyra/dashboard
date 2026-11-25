import { Search, X } from "lucide-react";
import { Kbd } from "../components/kbd";
import { Spinner } from "../components/spinner";
import { cn } from "../lib/cn";

type SearchBarProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  /** Also the accessible name. */
  placeholder?: string;
  /** Shows a spinner while results load. */
  loading?: boolean;
  /** A keyboard hint shown while the field is empty, e.g. "/". */
  shortcut?: string;
  className?: string;
}>;

/** A search field with a clear button and an optional loading state. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  loading = false,
  shortcut,
  className,
}: SearchBarProps) {
  return (
    <div
      role="search"
      className={cn(
        "border-input bg-background focus-within:ring-ring flex h-9 w-full items-center gap-2 rounded-md border px-3 focus-within:ring-2 sm:w-72",
        className,
      )}
    >
      <Search className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {loading ? (
        <Spinner />
      ) : value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring grid size-5 place-items-center rounded outline-none focus-visible:ring-2"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : shortcut ? (
        <Kbd>{shortcut}</Kbd>
      ) : null}
    </div>
  );
}
