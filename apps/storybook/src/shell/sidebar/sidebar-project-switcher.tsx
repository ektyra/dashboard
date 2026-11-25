import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { SidebarTooltip } from "./sidebar-tooltip";

export type Project = { id: string; name: string };

function ProjectMark({ name }: Readonly<{ name: string }>) {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Project / website selector. Renders nothing when there are no projects, so
 * the sidebar works before that feature exists.
 */
export function SidebarProjectSwitcher({
  projects,
  activeId: controlledId,
  onSelect,
  label = "Workspace",
  menuLabel = "Workspaces",
}: Readonly<{
  projects: Project[];
  /** The open project. Without it the switcher keeps its own choice. */
  activeId?: string;
  onSelect?: (id: string) => void;
  label?: string;
  menuLabel?: string;
}>) {
  const [ownId, setOwnId] = useState(projects[0]?.id);
  const activeId = controlledId ?? ownId;
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  if (!active) return null;

  return (
    <DropdownMenu>
      <SidebarTooltip label={active.name}>
        <DropdownMenuTrigger
          aria-label={`${label}: ${active.name}`}
          className="flex w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border border-sidebar-border bg-background px-2.5 py-2 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent/60 in-data-[sidebar=collapsed]:justify-center in-data-[sidebar=collapsed]:px-0"
        >
          <ProjectMark name={active.name} />
          <span className="grid min-w-0 flex-1 gap-0.5 in-data-[sidebar=collapsed]:hidden">
            <span className="truncate text-xs leading-none text-muted-foreground">{label}</span>
            <span className="truncate leading-tight font-semibold">{active.name}</span>
          </span>
          <ChevronsUpDown
            className="size-4 shrink-0 text-muted-foreground in-data-[sidebar=collapsed]:hidden"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
      </SidebarTooltip>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={active.id}
          onValueChange={(id) => {
            setOwnId(id);
            onSelect?.(id);
          }}
        >
          {projects.map((project) => (
            <DropdownMenuRadioItem key={project.id} value={project.id}>
              <ProjectMark name={project.name} />
              <span className="min-w-0 truncate">{project.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
