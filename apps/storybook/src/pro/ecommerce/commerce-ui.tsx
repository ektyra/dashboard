import { ChevronLeft, ChevronRight, Package, Search, X } from "lucide-react";
import { useId, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Button } from "../../components/button";
import { Field, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import type { Attribute } from "./config";
import { Badge } from "../../components/badge";
import {
  InputGroup,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
} from "../../components/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { cn } from "../../lib/cn";
import type { OrderStatus, Product } from "./store";

export { primaryActionClass } from "../../components/button";

const orderColors = {
  Pending: "warning",
  Paid: "success",
  Shipped: "info",
  Refunded: "outline",
} as const;

export function OrderBadge({ status }: Readonly<{ status: OrderStatus }>) {
  return <Badge variant={orderColors[status]}>{status}</Badge>;
}

export function ProductPhoto({
  product,
  className,
}: Readonly<{ product?: Pick<Product, "photo" | "imageUrl">; className?: string }>) {
  if (product?.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt=""
        className={cn("block aspect-square shrink-0 rounded-lg bg-muted object-cover", className)}
      />
    );
  }
  const photo = product?.photo;
  return photo ? (
    <span
      aria-hidden="true"
      className={cn(
        "block aspect-square shrink-0 rounded-lg bg-muted bg-[url('/products/studio-catalog.webp')] bg-size-[300%_200%] bg-no-repeat",
        className,
      )}
      style={{ backgroundPosition: `${photo[0] * 50}% ${photo[1] * 100}%` }}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "relative block aspect-square shrink-0 rounded-lg bg-muted text-muted-foreground",
        className,
      )}
    >
      <Package className="absolute inset-0 m-auto size-1/3" />
    </span>
  );
}

export function SearchBox({
  label,
  placeholder,
  value,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <InputGroup className="w-full sm:w-72">
      <InputGroupIcon>
        <Search aria-hidden="true" />
      </InputGroupIcon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={placeholder}
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

export function CommerceTable({
  label,
  columns,
  children,
  empty,
  emptyMessage,
}: Readonly<{
  label: string;
  columns: { label: string; className?: string }[];
  children: ReactNode;
  empty: boolean;
  emptyMessage: string;
}>) {
  return (
    <Table aria-label={label} wrapperClassName="bg-card">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map(({ label, className }) => (
            <TableHead key={label} scope="col" className={className}>
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          children
        )}
      </TableBody>
    </Table>
  );
}

export const rowLinkClass =
  "rounded-sm font-semibold underline-offset-4 hover:text-primary hover:underline dark:hover:text-foreground";

export function CommercePager({
  count,
  size,
  page,
  onPage,
  onSize,
}: Readonly<{
  count: number;
  size: number;
  page: number;
  onPage: (page: number) => void;
  onSize: (size: number) => void;
}>) {
  const pages = Math.max(1, Math.ceil(count / size));
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm">
      <p role="status" className="text-muted-foreground">
        {count
          ? `${page * size + 1}–${Math.min((page + 1) * size, count)} of ${count}`
          : "0 results"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <NativeSelect
          aria-label="Rows per page"
          value={String(size)}
          onChange={(event) => onSize(Number(event.target.value))}
        >
          {[5, 8, 12, 24].map((option) => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </NativeSelect>
        <Button
          size="icon"
          variant="outline"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="px-1 tabular-nums">
          {page + 1} / {pages}
        </span>
        <Button
          size="icon"
          variant="outline"
          aria-label="Next page"
          disabled={page + 1 === pages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export function useCommercePage(count: number, initialSize = 8) {
  const [size, setSize] = useState(initialSize);
  const [index, setIndex] = useState(0);
  const page = Math.max(0, Math.min(index, Math.ceil(count / size) - 1));
  return {
    count,
    size,
    page,
    onPage: setIndex,
    onSize: (next: number) => {
      setSize(next);
      setIndex(0);
    },
  };
}

export function AttributeFields({
  definitions,
  values,
  onChange,
}: Readonly<{
  definitions: Attribute[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}>) {
  const base = useId();
  return (
    <div className="grid gap-4">
      {definitions.map(({ id, name, options }) => {
        const current = values[id] ?? "";
        const props = {
          id: `${base}-${id}`,
          value: current,
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            onChange({ ...values, [id]: event.target.value }),
        };
        return (
          <Field key={id}>
            <FieldLabel htmlFor={props.id}>{name}</FieldLabel>
            {options.length ? (
              <NativeSelect {...props}>
                <option value="">Unspecified</option>
                {current && !options.includes(current) && <option>{current}</option>}
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </NativeSelect>
            ) : (
              <Input {...props} maxLength={120} />
            )}
          </Field>
        );
      })}
    </div>
  );
}

export function DeliveryBadge({
  status,
}: Readonly<{ status: "Delivered" | "Shipped" | "Closed" | "Unfulfilled" }>) {
  const variant = status === "Delivered" ? "success" : status === "Shipped" ? "info" : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
