import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, Store } from "lucide-react";
import { LineChart } from "../../widgets/charts";
import { PageHeader } from "../../shell/page-header";
import { ChartCard } from "../../components/chart-card";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { EmptyState } from "../../components/empty-state";
import { NativeSelect } from "../../components/native-select";
import { StatCard } from "../../components/stat-card";
import { TableCell, TableRow } from "../../components/table";
import { newMessageRequest } from "../mail-store";
import { CommerceTable, ProductPhoto, rowLinkClass, SearchBox } from "./commerce-ui";
import { reviewsStore, sellerById, sellers } from "./marketplace";
import { dailySales, sellerStats } from "./report-data";
import {
  effectivePrice,
  formatOrderDate,
  formatPrice,
  matchesSearch,
  ordersStore,
  productsStore,
} from "./store";

function useSellerRows() {
  const products = productsStore.use();
  const orders = ordersStore.use();
  const reviews = reviewsStore.use();
  return sellers.map((seller) => {
    const catalog = products.filter((product) => product.sellerId === seller.id);
    const ids = new Set(catalog.map((product) => product.id));
    const ratings = reviews.filter(
      (review) => review.status === "Published" && ids.has(review.productId),
    );
    return {
      seller,
      catalog,
      ...sellerStats(seller.id, orders),
      rating: ratings.length
        ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length
        : undefined,
    };
  });
}

const sellerColumns = [
  { label: "Seller" },
  { label: "Products", className: "hidden sm:table-cell" },
  { label: "Orders" },
  { label: "Rating", className: "hidden md:table-cell" },
  { label: "Location", className: "hidden lg:table-cell" },
  { label: "Net sales", className: "text-right" },
];

export function SellersPage() {
  const rows = useSellerRows();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("sales");
  const visible = rows
    .filter(({ seller }) =>
      matchesSearch(query, seller.name, seller.owner, seller.city, seller.country),
    )
    .sort((a, b) =>
      sort === "orders"
        ? b.related.length - a.related.length
        : sort === "rating"
          ? (b.rating ?? 0) - (a.rating ?? 0)
          : b.sales - a.sales,
    );
  return (
    <>
      <PageHeader title="Sellers" subtitle="Browse the studios behind the sample catalog." />
      <div className="grid min-w-0 gap-4">
        <div className="flex flex-wrap gap-2">
          <SearchBox
            label="Search sellers"
            placeholder="Search sellers or locations…"
            value={query}
            onChange={setQuery}
          />
          <NativeSelect
            aria-label="Sort sellers"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="sales">Most sales</option>
            <option value="orders">Most orders</option>
            <option value="rating">Highest rating</option>
          </NativeSelect>
        </div>
        <CommerceTable
          label="Sellers"
          columns={sellerColumns}
          empty={!visible.length}
          emptyMessage="No sellers match this search."
        >
          {visible.map(({ seller, catalog, related, sales, rating }) => (
            <TableRow key={seller.id}>
              <TableCell className="max-sm:px-2">
                <div className="flex items-center gap-2.5">
                  <Avatar aria-hidden="true" className="hidden sm:flex">
                    <AvatarFallback>{seller.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      className={rowLinkClass}
                      to="/apps/ecommerce/sellers/$sellerId"
                      params={{ sellerId: seller.id }}
                    >
                      {seller.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Since {seller.since}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden tabular-nums sm:table-cell">{catalog.length}</TableCell>
              <TableCell className="tabular-nums max-sm:px-2">{related.length}</TableCell>
              <TableCell className="hidden tabular-nums md:table-cell">
                {rating?.toFixed(1) ?? "—"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {seller.city}, {seller.country}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap tabular-nums max-sm:px-2">
                {formatPrice(sales)}
              </TableCell>
            </TableRow>
          ))}
        </CommerceTable>
      </div>
    </>
  );
}

export function SellerPage({ sellerId }: Readonly<{ sellerId: string }>) {
  const rows = useSellerRows();
  const navigate = useNavigate();
  const seller = sellerById(sellerId);
  const row = rows.find((entry) => entry.seller.id === sellerId);
  if (!seller || !row)
    return (
      <>
        <PageHeader title="Seller unavailable" />
        <EmptyState
          icon={<Store aria-hidden="true" />}
          title="Seller not found"
          action={
            <Button variant="outline" asChild>
              <Link to="/apps/ecommerce/sellers">
                <ArrowLeft aria-hidden="true" />
                Back to sellers
              </Link>
            </Button>
          }
        />
      </>
    );

  const days = dailySales(row.related, (line) => line.sellerId === seller.id);
  return (
    <>
      <PageHeader
        title={seller.name}
        current={seller.name}
        subtitle={seller.specialty}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              newMessageRequest.set(seller.email);
              void navigate({ to: "/apps/email" });
            }}
          >
            <Mail aria-hidden="true" />
            Contact seller
          </Button>
        }
      />
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <Card className="min-w-0 shadow-none">
          <CardHeader>
            <CardTitle>Seller profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <Avatar aria-hidden="true" className="size-12">
              <AvatarFallback className="text-lg">{seller.initials}</AvatarFallback>
            </Avatar>
            <dl className="grid gap-3">
              {[
                ["Owner", seller.owner],
                ["Location", `${seller.city}, ${seller.country}`],
                ["Selling since", seller.since],
                ["Contact", seller.email],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="Orders" value={String(row.related.length)} />
            <StatCard label="Net sales" value={formatPrice(row.sales)} />
            <StatCard label="Average rating" value={row.rating?.toFixed(1) ?? "—"} />
            <StatCard label="Products" value={String(row.catalog.length)} />
          </div>
          <ChartCard
            title="Seller sales"
            description="Paid sales for this seller’s products, excluding refunds."
            height={220}
            table={{
              columns: ["Date", "Sales"],
              rows: days.map((day) => [formatOrderDate(day.date), formatPrice(day.sales)]),
            }}
          >
            <LineChart
              currency
              labels={days.map((day) => day.date.slice(5).replace("-", "/"))}
              lines={[{ label: "Sales", data: days.map((day) => day.sales / 100) }]}
            />
          </ChartCard>
          <section className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Seller products</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/apps/ecommerce/products" search={{ seller: seller.id }}>
                  Open in catalog
                </Link>
              </Button>
            </div>
            <CommerceTable
              label="Seller products"
              columns={[
                { label: "Product" },
                { label: "Stock" },
                { label: "Price", className: "text-right" },
              ]}
              empty={!row.catalog.length}
              emptyMessage="No products are assigned to this seller."
            >
              {row.catalog.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProductPhoto product={product} className="hidden size-9 sm:block" />
                      <Link
                        className={rowLinkClass}
                        to="/apps/ecommerce/products/$productId"
                        params={{ productId: product.id }}
                      >
                        {product.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPrice(effectivePrice(product))}
                  </TableCell>
                </TableRow>
              ))}
            </CommerceTable>
          </section>
        </div>
      </div>
    </>
  );
}
