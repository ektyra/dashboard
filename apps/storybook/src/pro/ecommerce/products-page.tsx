import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Archive, Boxes, LayoutGrid, List, PackageCheck, Plus, TriangleAlert } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { EmptyState } from "../../components/empty-state";
import { NativeSelect } from "../../components/native-select";
import { StatCard } from "../../components/stat-card";
import { TableCell, TableRow } from "../../components/table";
import {
  CommercePager,
  CommerceTable,
  primaryActionClass,
  ProductPhoto,
  rowLinkClass,
  SearchBox,
  useCommercePage,
} from "./commerce-ui";
import { categoriesStore } from "./config";
import { reviewsStore, sellerById } from "./marketplace";
import {
  effectivePrice,
  formatPrice,
  matchesSearch,
  ordersStore,
  productsStore,
  productStatuses,
} from "./store";
import type { Product } from "./store";

const columns = [
  { label: "Product" },
  { label: "Category", className: "hidden lg:table-cell" },
  { label: "Stock" },
  { label: "Price", className: "text-right" },
  { label: "Orders", className: "hidden text-right xl:table-cell" },
  { label: "Rating", className: "hidden text-right xl:table-cell" },
  { label: "Status", className: "hidden md:table-cell" },
];

function Price({ product }: Readonly<{ product: Product }>) {
  return (
    <span className="whitespace-nowrap tabular-nums">
      <span className="font-medium">{formatPrice(effectivePrice(product))}</span>
      {product.discount && (
        <del className="block text-xs text-muted-foreground">{formatPrice(product.price)}</del>
      )}
    </span>
  );
}

function ProductStatus({ product }: Readonly<{ product: Product }>) {
  return (
    <Badge variant={product.status === "Active" ? "success" : "outline"}>{product.status}</Badge>
  );
}

export function ProductsPage({
  category: initialCategory,
  seller,
}: Readonly<{ category?: string; seller?: string }>) {
  const products = productsStore.use();
  const categories = categoriesStore.use();
  const orders = ordersStore.use();
  const reviews = reviewsStore.use();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [grid, setGrid] = useState(false);
  const sellerName = sellerById(seller)?.name;
  const visible = products.filter(
    (product) =>
      (!category || category === product.category) &&
      (!seller || seller === product.sellerId) &&
      (!status || status === product.status) &&
      (!stock ||
        (stock === "low" ? product.stock > 0 && product.stock < 10 : product.stock === 0)) &&
      (!price ||
        (price === "under" ? effectivePrice(product) < 2500 : effectivePrice(product) >= 2500)) &&
      matchesSearch(
        query,
        product.name,
        product.sku,
        categories.find((entry) => entry.id === product.category)?.name ?? "",
        product.subcategory ?? "",
        product.brand ?? "",
        sellerById(product.sellerId)?.name ?? "",
        ...(product.tags ?? []),
      ),
  );
  if (sort === "price") visible.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (sort === "stock") visible.sort((a, b) => a.stock - b.stock);
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  const pager = useCommercePage(visible.length, 5);
  const { page, size, onPage } = pager;
  const rows = visible.slice(page * size, (page + 1) * size);
  const counts = [
    { label: "Catalog", value: products.length, icon: Boxes },
    {
      label: "Active",
      value: products.filter((product) => product.status === "Active").length,
      icon: PackageCheck,
    },
    {
      label: "Needs restock",
      value: products.filter((product) => product.status === "Active" && product.stock < 10).length,
      icon: TriangleAlert,
    },
    {
      label: "Draft or archived",
      value: products.filter((product) => product.status !== "Active").length,
      icon: Archive,
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage sample products, inventory, and prices."
        actions={
          <Button className={primaryActionClass} asChild>
            <Link to="/apps/ecommerce/products/$productId" params={{ productId: "new" }}>
              <Plus aria-hidden="true" />
              Add product
            </Link>
          </Button>
        }
      />
      <div className="grid min-w-0 gap-5">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {counts.map(({ label, value, icon: Icon }) => (
            <StatCard
              key={label}
              label={label}
              value={String(value)}
              icon={<Icon aria-hidden="true" />}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchBox
            label="Search products"
            placeholder="Search products or SKUs…"
            value={query}
            onChange={(value) => {
              setQuery(value);
              onPage(0);
            }}
          />
          <NativeSelect
            aria-label="Product category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              onPage(0);
            }}
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Product status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              onPage(0);
            }}
          >
            <option value="">All statuses</option>
            {productStatuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Stock level"
            value={stock}
            onChange={(event) => {
              setStock(event.target.value);
              onPage(0);
            }}
          >
            <option value="">All stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </NativeSelect>
          <NativeSelect
            aria-label="Price range"
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              onPage(0);
            }}
          >
            <option value="">Any price</option>
            <option value="under">Under $25</option>
            <option value="over">$25 and up</option>
          </NativeSelect>
          <NativeSelect
            aria-label="Sort products"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              onPage(0);
            }}
          >
            <option value="">Catalog order</option>
            <option value="name">Name A–Z</option>
            <option value="price">Price, low first</option>
            <option value="stock">Stock, low first</option>
          </NativeSelect>
          <div className="ml-auto flex gap-1" role="group" aria-label="Product view">
            <Button
              size="icon"
              variant={!grid ? "secondary" : "outline"}
              aria-label="Table view"
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              <List aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant={grid ? "secondary" : "outline"}
              aria-label="Grid view"
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              <LayoutGrid aria-hidden="true" />
            </Button>
          </div>
        </div>
        {sellerName && (
          <div className="flex items-center gap-2 text-sm">
            {sellerName}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/apps/ecommerce/products">Clear seller filter</Link>
            </Button>
          </div>
        )}
        {grid ? (
          rows.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              {rows.map((product) => (
                <Card key={product.id} className="min-w-0 overflow-hidden shadow-none">
                  <ProductPhoto product={product} className="w-full rounded-none" />
                  <CardContent className="grid gap-2 p-3 sm:p-4">
                    <Link
                      className={rowLinkClass}
                      to="/apps/ecommerce/products/$productId"
                      params={{ productId: product.id }}
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                    <div className="flex flex-wrap items-start justify-between gap-2 text-sm">
                      <Price product={product} />
                      <ProductStatus product={product} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No products match these filters." />
          )
        ) : (
          <CommerceTable
            label="Products"
            columns={columns}
            empty={!rows.length}
            emptyMessage="No products match these filters."
          >
            {rows.map((product) => {
              const count = orders.filter((order) =>
                order.lines.some((line) => line.productId === product.id),
              ).length;
              const ratings = reviews.filter(
                (review) => review.productId === product.id && review.status === "Published",
              );
              const average = ratings.length
                ? (
                    ratings.reduce((total, review) => total + review.rating, 0) / ratings.length
                  ).toFixed(1)
                : "—";
              return (
                <TableRow key={product.id}>
                  <TableCell className="max-sm:px-2">
                    <div className="flex items-center gap-3">
                      <ProductPhoto product={product} className="hidden size-11 sm:block" />
                      <div className="min-w-0">
                        <Link
                          to="/apps/ecommerce/products/$productId"
                          params={{ productId: product.id }}
                          className={rowLinkClass}
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs break-words text-muted-foreground">
                          {product.sku}
                          {product.brand ? ` · ${product.brand}` : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {categories.find((entry) => entry.id === product.category)?.name ??
                      product.category}
                  </TableCell>
                  <TableCell className="whitespace-nowrap max-sm:px-2">
                    <span className="tabular-nums">{product.stock}</span>
                    {product.stock < 10 && (
                      <p className="text-xs text-warning-text">
                        {product.stock ? "Low" : "Sold out"}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right max-sm:px-2">
                    <Price product={product} />
                  </TableCell>
                  <TableCell className="hidden text-right tabular-nums xl:table-cell">
                    {count}
                  </TableCell>
                  <TableCell className="hidden text-right tabular-nums xl:table-cell">
                    {average}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ProductStatus product={product} />
                  </TableCell>
                </TableRow>
              );
            })}
          </CommerceTable>
        )}
        <CommercePager {...pager} />
      </div>
    </>
  );
}
