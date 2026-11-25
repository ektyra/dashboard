import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { Field, FieldLabel } from "./field";
import { InputGroup, InputGroupButton, InputGroupIcon, InputGroupInput } from "./input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export function RecordTable({
  label,
  columns,
  children,
  empty,
}: Readonly<{
  label: string;
  columns: (string | { name: string; className?: string })[];
  children: ReactNode;
  empty?: string;
}>) {
  return (
    <Table aria-label={label} wrapperClassName="min-w-0 bg-card">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) =>
            typeof column === "string" ? (
              <TableHead key={column} scope="col">
                {column}
              </TableHead>
            ) : (
              <TableHead key={column.name} scope="col" className={column.className}>
                {column.name}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          children
        )}
      </TableBody>
    </Table>
  );
}

export function SearchInput({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <InputGroup className="w-full sm:w-64">
      <InputGroupIcon>
        <Search aria-hidden="true" />
      </InputGroupIcon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={label + "…"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <InputGroupButton aria-label="Clear search" onClick={() => onChange("")}>
          <X aria-hidden="true" />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}

export function FormField({
  id,
  label,
  children,
  className,
}: Readonly<{
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function SummaryFields({
  values,
}: Readonly<{ values: [label: string, value: ReactNode][] }>) {
  return (
    <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
      {values.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="mt-1 wrap-anywhere whitespace-pre-line">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function textField(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}
