import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pencil, Plus, Tags } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Field, FieldError, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import { TableCell, TableRow } from "../../components/table";
import { notify } from "../../toast";
import {
  AttributeFields,
  CommercePager,
  CommerceTable,
  primaryActionClass,
  rowLinkClass,
  SearchBox,
  useCommercePage,
} from "./commerce-ui";
import {
  categoriesStore,
  categoryAttributesStore,
  nextConfigId,
  splitList,
  withRecord,
} from "./config";
import type { Category } from "./config";
import { formatPrice, matchesSearch, ordersStore, productsStore } from "./store";

const columns = [
  { label: "Category" },
  { label: "Slug", className: "hidden lg:table-cell" },
  { label: "Products" },
  { label: "Orders", className: "hidden md:table-cell" },
  { label: "Net sales", className: "hidden lg:table-cell" },
  { label: "Status", className: "hidden sm:table-cell" },
  { label: "Actions" },
];

export function CategoriesPage() {
  const categories = categoriesStore.use();
  const products = productsStore.use();
  const orders = ordersStore.use();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState<Category | "new" | null>(null);
  const rows = categories.filter(
    (category) =>
      (!status || category.active === (status === "active")) &&
      matchesSearch(query, category.name, category.slug, ...category.subcategories),
  );
  const pager = useCommercePage(rows.length);
  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize the storefront and see which products belong to each category."
        actions={
          <Button className={primaryActionClass} onClick={() => setDraft("new")}>
            <Plus aria-hidden="true" />
            Add category
          </Button>
        }
      />
      <div className="grid min-w-0 gap-4">
        {draft && (
          <CategoryForm
            key={draft === "new" ? draft : draft.id}
            category={draft === "new" ? undefined : draft}
            onClose={() => setDraft(null)}
          />
        )}
        <div className="flex flex-wrap gap-2">
          <SearchBox
            label="Search categories"
            placeholder="Search categories…"
            value={query}
            onChange={(value) => {
              setQuery(value);
              pager.onPage(0);
            }}
          />
          <NativeSelect
            aria-label="Category status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              pager.onPage(0);
            }}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </NativeSelect>
        </div>
        <CommerceTable
          label="Categories"
          columns={columns}
          empty={!rows.length}
          emptyMessage="No categories match these filters."
        >
          {rows.slice(pager.page * pager.size, (pager.page + 1) * pager.size).map((category) => {
            const ids = new Set(
              products
                .filter((product) => product.category === category.id)
                .map((product) => product.id),
            );
            const related = orders.filter((order) =>
              order.lines.some((line) => ids.has(line.productId)),
            );
            const revenue = related.reduce(
              (sum, order) =>
                order.status === "Paid" || order.status === "Shipped"
                  ? sum +
                    order.lines.reduce(
                      (total, line) =>
                        total + (ids.has(line.productId) ? line.unitPrice * line.quantity : 0),
                      0,
                    )
                  : sum,
              0,
            );
            return (
              <TableRow key={category.id}>
                <TableCell className="max-sm:px-2">
                  <span className="flex items-center gap-2">
                    <Tags
                      className="hidden size-4 text-muted-foreground sm:block"
                      aria-hidden="true"
                    />
                    <Link
                      className={rowLinkClass}
                      to="/apps/ecommerce/products"
                      search={{ category: category.id }}
                    >
                      {category.name}
                    </Link>
                  </span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {category.slug}
                </TableCell>
                <TableCell className="tabular-nums max-sm:px-2">{ids.size}</TableCell>
                <TableCell className="hidden tabular-nums md:table-cell">
                  {related.length}
                </TableCell>
                <TableCell className="hidden tabular-nums lg:table-cell">
                  {formatPrice(revenue)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={category.active ? "success" : "outline"}>
                    {category.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="max-sm:px-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => setDraft(category)}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </CommerceTable>
        <CommercePager {...pager} />
      </div>
    </>
  );
}

function CategoryForm({
  category,
  onClose,
}: Readonly<{ category?: Category; onClose: () => void }>) {
  const id = useId();
  const definitions = categoryAttributesStore.use();
  const [attributes, setAttributes] = useState(category?.attributes ?? {});
  const [error, setError] = useState("");
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{category ? `Edit ${category.name}` : "Add category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-2xl gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const name = readText(data, "name");
            const slug =
              readText(data, "slug").toLowerCase() ||
              name
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{M}/gu, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            const current = categoriesStore.get();
            if (
              !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
              current.some((entry) => entry.slug === slug && entry.id !== category?.id)
            ) {
              setError("Use a unique slug with lowercase letters, numbers, and hyphens.");
              return;
            }
            categoriesStore.set(
              withRecord(current, {
                id: category?.id ?? nextConfigId("category"),
                name,
                slug,
                attributes,
                active: readText(data, "status") === "active",
                subcategories: splitList(readText(data, "subcategories")),
              }),
            );
            notify.success(category ? "Category updated" : "Category added");
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>Category name</FieldLabel>
              <Input
                id={`${id}-name`}
                name="name"
                required
                pattern=".*\S.*"
                maxLength={80}
                defaultValue={category?.name}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-slug`}>Slug</FieldLabel>
              <Input
                id={`${id}-slug`}
                name="slug"
                maxLength={100}
                defaultValue={category?.slug}
                placeholder="Generated from the name"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={() => setError("")}
              />
              <FieldError id={`${id}-error`} errors={[error]} />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-subcategories`}>Subcategories</FieldLabel>
              <Input
                id={`${id}-subcategories`}
                name="subcategories"
                defaultValue={category?.subcategories.join(", ")}
                placeholder="Separate names with commas"
                maxLength={250}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
              <NativeSelect
                id={`${id}-status`}
                name="status"
                defaultValue={category?.active === false ? "inactive" : "active"}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </NativeSelect>
            </Field>
          </div>
          {definitions.length > 0 && (
            <fieldset className="grid gap-3 border-t border-border pt-3">
              <legend className="px-1 text-sm font-medium">Category attributes</legend>
              <AttributeFields
                definitions={definitions}
                values={attributes}
                onChange={setAttributes}
              />
            </fieldset>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" className={primaryActionClass}>
              Save category
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function readText(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}
