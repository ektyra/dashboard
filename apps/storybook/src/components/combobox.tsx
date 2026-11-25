import { useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";

export type ComboboxOption = {
  value: string;
  label: string;
  /** Shown before the label, such as a flag. */
  icon?: ReactNode;
  /** Quiet text at the end of the row, such as a country code. Searched too. */
  hint?: string;
};

type SharedProps = Readonly<{
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Options are being fetched. Shows a spinner in the field and a "Loading" row in the list. */
  loading?: boolean;
  loadingText?: string;
  /**
   * Search on the server: called with what was typed, and the list is then shown
   * as you give it (no filtering in the browser). Debounce the fetch yourself.
   */
  onSearchChange?: (query: string) => void;
  /** Shown instead of the list when loading failed. */
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}>;

const triggerClass =
  "flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

function TriggerIcon({ loading }: Readonly<{ loading?: boolean }>) {
  return loading ? (
    <Spinner className="shrink-0 text-muted-foreground" aria-label="Loading" />
  ) : (
    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
  );
}

/** The list of options, with the loading, error and empty states shared by both comboboxes. */
function OptionList({
  options,
  loading,
  loadingText,
  error,
  emptyText,
  searchPlaceholder,
  onSearchChange,
  isSelected,
  onPick,
}: Readonly<{
  options: ComboboxOption[];
  loading?: boolean;
  loadingText: string;
  error?: ReactNode;
  emptyText: string;
  searchPlaceholder: string;
  onSearchChange?: (query: string) => void;
  isSelected: (value: string) => boolean;
  onPick: (option: ComboboxOption) => void;
}>) {
  return (
    // With a server search, the server decides what matches, so the browser must not filter again.
    <Command className="border-0 bg-transparent" shouldFilter={!onSearchChange}>
      <CommandInput placeholder={searchPlaceholder} onValueChange={onSearchChange} />
      <CommandList aria-busy={loading || undefined}>
        {loading && (
          <div
            role="status"
            className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
            {loadingText}
          </div>
        )}
        {!loading && error && (
          <div role="alert" className="px-3 py-5 text-center text-sm text-destructive-text">
            {error}
          </div>
        )}
        {!loading && !error && <CommandEmpty>{emptyText}</CommandEmpty>}
        {!loading && !error && (
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                keywords={[option.value, option.hint ?? ""]}
                onSelect={() => onPick(option)}
              >
                {option.icon}
                <span className="truncate">{option.label}</span>
                {option.hint && (
                  <span className="ml-auto pl-2 text-xs text-muted-foreground uppercase">
                    {option.hint}
                  </span>
                )}
                {isSelected(option.value) && (
                  <Check
                    className={cn("text-primary!", !option.hint && "ml-auto")}
                    aria-hidden="true"
                  />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

type ComboboxProps = SharedProps &
  Readonly<{
    value: string | undefined;
    onValueChange: (value: string | undefined) => void;
  }>;

/** A select you can search. Pick one option. Can load its options, or search on a server. */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "Nothing found.",
  loading,
  loadingText = "Loading…",
  onSearchChange,
  error,
  disabled,
  className,
  id,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-busy={loading || undefined}
          disabled={disabled}
          className={cn(triggerClass, className)}
        >
          <span
            className={cn("flex min-w-0 items-center gap-2", !selected && "text-muted-foreground")}
          >
            {selected?.icon}
            <span className="truncate">{selected?.label ?? placeholder}</span>
          </span>
          <TriggerIcon loading={loading} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <OptionList
          options={options}
          loading={loading}
          loadingText={loadingText}
          error={error}
          emptyText={emptyText}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          isSelected={(optionValue) => optionValue === value}
          onPick={(option) => {
            onValueChange(option.value === value ? undefined : option.value);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type MultiSelectProps = SharedProps &
  Readonly<{
    value: string[];
    onValueChange: (value: string[]) => void;
    /** Labels for chosen values that are not in `options` right now (for example after a new server search). */
    knownOptions?: ComboboxOption[];
  }>;

/** Pick several options. Chosen ones show as removable badges. Can load or search on a server. */
export function MultiSelect({
  options,
  value,
  onValueChange,
  knownOptions = [],
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "Nothing found.",
  loading,
  loadingText = "Loading…",
  onSearchChange,
  error,
  disabled,
  className,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const toggle = (optionValue: string) =>
    onValueChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  const labelOf = (item: string) =>
    [...options, ...knownOptions].find((candidate) => candidate.value === item)?.label ?? item;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-busy={loading || undefined}
          disabled={disabled}
          className={cn(triggerClass, "h-auto", className)}
        >
          <span className="flex flex-wrap gap-1">
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {value.map((item) => (
              <Badge key={item} variant="secondary" className="gap-1 pr-1">
                {labelOf(item)}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${labelOf(item)}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(item);
                  }}
                  className="grid size-4 cursor-pointer place-items-center rounded-full hover:bg-foreground/10"
                >
                  <X className="size-3" aria-hidden="true" />
                </span>
              </Badge>
            ))}
          </span>
          <TriggerIcon loading={loading} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <OptionList
          options={options}
          loading={loading}
          loadingText={loadingText}
          error={error}
          emptyText={emptyText}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          isSelected={(optionValue) => value.includes(optionValue)}
          onPick={(option) => toggle(option.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
