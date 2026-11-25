import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CommandMenu } from "./command-menu";

export function NavbarSearch() {
  const [open, setOpen] = useState(false);

  // Cmd+K on macOS, Ctrl+K elsewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
