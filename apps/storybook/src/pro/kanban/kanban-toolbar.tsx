import { Search, X } from "lucide-react";
import { Button } from "../../components/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
} from "../../components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { labels, members } from "./kanban-data";

export type Filters = { search: string; assignee: string; label: string };
export const noFilters: Filters = { search: "", assignee: "all", label: "all" };

type KanbanToolbarProps = Readonly<{ filters: Filters; onChange: (filters: Filters) => void }>;

export function KanbanToolbar({ filters, onChange }: KanbanToolbarProps) {
  const active = filters.search !== "" || filters.assignee !== "all" || filters.label !== "all";
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <InputGroup className="h-8 w-full sm:w-64">
        <InputGroupIcon>
          <Search aria-hidden="true" />
        </InputGroupIcon>
        <InputGroupInput
          type="search"
          aria-label="Search cards"
          placeholder="Search cards…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
        {filters.search && (
          <InputGroupButton
            aria-label="Clear search"
            onClick={() => onChange({ ...filters, search: "" })}
          >
            <X aria-hidden="true" />
          </InputGroupButton>
        )}
      </InputGroup>
      <Select
        value={filters.assignee}
        onValueChange={(assignee) => onChange({ ...filters, assignee })}
      >
        <SelectTrigger aria-label="Filter by person" className="h-8 w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Everyone</SelectItem>
          {members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.label} onValueChange={(label) => onChange({ ...filters, label })}>
        <SelectTrigger aria-label="Filter by label" className="h-8 w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All labels</SelectItem>
          {labels.map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {active && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onChange(noFilters)}>
            Reset
            <X aria-hidden="true" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Dragging is paused while a filter is on.
          </span>
        </>
      )}
    </div>
  );
}
