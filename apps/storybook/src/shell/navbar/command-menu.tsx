import { useNavigate } from "@tanstack/react-router";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/command";
import { useTheme } from "../theme";
import type { Theme } from "../theme";
import { useLayoutConfig } from "../config/layout-config";
import { getSearchablePages } from "../navigation";

const themes = [
  { value: "light", label: "themeLight", icon: Sun },
  { value: "dark", label: "themeDark", icon: Moon },
  { value: "system", label: "themeSystem", icon: Monitor },
] as const satisfies readonly { value: Theme; label: string; icon: typeof Sun }[];

type CommandMenuProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { labels, navigation } = useLayoutConfig();

  const run = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} label={labels.commandSearch}>
      <CommandInput placeholder={labels.commandPlaceholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={labels.commandPages}>
          {getSearchablePages(navigation).map(({ label, to, icon: Icon, group }) => (
            <CommandItem
              key={`${group ?? ""}${to}`}
              value={`${group ?? ""} ${label}`}
              onSelect={() => run(() => void navigate({ to }))}
            >
              <Icon aria-hidden="true" />
              {label}
              {group && <span className="ml-auto text-xs text-muted-foreground">{group}</span>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={labels.commandTheme}>
          {themes.map(({ value, label, icon: Icon }) => (
            <CommandItem
              key={value}
              value={labels[label]}
              onSelect={() => run(() => setTheme(value))}
            >
              <Icon aria-hidden="true" />
              {labels[label]}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
