import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { BarChart } from "../../widgets/charts";
import { PageHeader } from "../../shell/page-header";
import { ChartCard } from "../../components/chart-card";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { NativeSelect } from "../../components/native-select";
import { Progress } from "../../components/progress";
import { TableCell, TableRow } from "../../components/table";
import { notify } from "../../toast";
import {
  CommercePager,
  CommerceTable,
  ProductPhoto,
  rowLinkClass,
  SearchBox,
  useCommercePage,
} from "./commerce-ui";
import { reviewsStore, reviewStatuses } from "./marketplace";
import { calendarDays } from "./report-data";
import { customersStore, formatOrderDate, matchesSearch, productsStore } from "./store";

const stars = [5, 4, 3, 2, 1];
const columns = [
  { label: "Product", className: "hidden md:table-cell" },
  { label: "Review" },
  { label: "Date", className: "hidden lg:table-cell" },
  { label: "Actions" },
];

export function ReviewsPage() {
  const reviews = reviewsStore.use();
  const products = productsStore.use();
  const customers = customersStore.use();
  const customerById = (id: string) => customers.find((customer) => customer.id === id);
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const published = reviews.filter((review) => review.status === "Published");
  const average = published.length
    ? (published.reduce((sum, review) => sum + review.rating, 0) / published.length).toFixed(1)
    : "—";
  const reviewCounts = new Map<string, number>();
  for (const review of reviews) {
    reviewCounts.set(review.date, (reviewCounts.get(review.date) ?? 0) + 1);
  }
  const days = calendarDays(reviewCounts.keys());
  const volume = days.map((day) => reviewCounts.get(day) ?? 0);
  const visible = reviews.filter(
    (review) =>
      (!rating || review.rating === Number(rating)) &&
      (!status || review.status === status) &&
      matchesSearch(
        query,
        review.title,
        review.text,
        products.find((product) => product.id === review.productId)?.name ?? "",
        customerById(review.customerId)?.name ?? "",
      ),
  );
  const pager = useCommercePage(visible.length, 5);

  return (
    <>
      <PageHeader title="Reviews" subtitle="Read and moderate sample product reviews." />
      <div className="grid min-w-0 gap-5">
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Card className="min-w-0 shadow-none">
            <CardHeader>
              <CardTitle>Published ratings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="flex items-center gap-2 text-3xl font-semibold tabular-nums">
                  {average}
                  <Star className="size-5 fill-warning text-warning" aria-hidden="true" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {published.length} published ·{" "}
                  {reviews.filter((review) => review.status === "Pending").length} pending
                </p>
              </div>
              <div className="grid gap-2">
                {stars.map((value) => {
                  const count = published.filter((review) => review.rating === value).length;
                  return (
                    <div
                      key={value}
                      className="grid grid-cols-[4rem_minmax(0,1fr)_1.5rem] items-center gap-3 text-sm"
                    >
                      <span>
                        {value} {value === 1 ? "star" : "stars"}
                      </span>
                      <Progress
                        aria-label={`${value}-star review share`}
                        value={published.length ? (100 * count) / published.length : 0}
                      />
                      <span className="text-right tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <ChartCard
            title="Review activity"
            description="Reviews submitted by date, across all statuses."
            height={210}
            table={{
              columns: ["Date", "Reviews"],
              rows: days.map((day, index) => [formatOrderDate(day), volume[index] ?? 0]),
            }}
          >
            <BarChart
              labels={days.map((day) => day.slice(5).replace("-", "/"))}
              data={volume}
              label="Reviews"
            />
          </ChartCard>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchBox
            label="Search reviews"
            placeholder="Search reviews or products…"
            value={query}
            onChange={(value) => {
              setQuery(value);
              pager.onPage(0);
            }}
          />
          <NativeSelect
            aria-label="Review rating"
            value={rating}
            onChange={(event) => {
              setRating(event.target.value);
              pager.onPage(0);
            }}
          >
            <option value="">All ratings</option>
            {stars.map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "star" : "stars"}
              </option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Review status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              pager.onPage(0);
            }}
          >
            <option value="">All statuses</option>
            {reviewStatuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </NativeSelect>
        </div>
        <CommerceTable
          label="Reviews"
          columns={columns}
          empty={!visible.length}
          emptyMessage="No reviews match these filters."
        >
          {visible.slice(pager.page * pager.size, (pager.page + 1) * pager.size).map((review) => {
            const product = products.find((item) => item.id === review.productId);
            const customer = customerById(review.customerId);
            const next = review.status === "Published" ? "Hidden" : "Published";
            return (
              <TableRow key={review.id}>
                <TableCell className="hidden md:table-cell">
                  {product && (
                    <div className="flex items-center gap-2">
                      <ProductPhoto product={product} className="hidden size-9 lg:block" />
                      <Link
                        className={rowLinkClass}
                        to="/apps/ecommerce/products/$productId"
                        params={{ productId: product.id }}
                      >
                        {product.name}
                      </Link>
                    </div>
                  )}
                </TableCell>
                <TableCell className="max-sm:px-2">
                  <p className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      aria-label={`${review.rating} of 5 stars`}
                      className="inline-flex items-center gap-1 text-sm text-warning-text"
                    >
                      <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                      {review.rating}/5
                    </span>
                    <Badge
                      variant={
                        review.status === "Published"
                          ? "success"
                          : review.status === "Pending"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {review.status}
                    </Badge>
                  </p>
                  <p className="font-semibold">{review.title}</p>
                  <p className="max-w-2xl text-sm text-muted-foreground">{review.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {customer?.name}
                    {product && <span className="md:hidden"> · {product.name}</span>}
                  </p>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                  {formatOrderDate(review.date)}
                </TableCell>
                <TableCell className="max-sm:px-2">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`${next === "Published" ? "Publish" : "Hide"} review: ${review.title}`}
                    onClick={() => {
                      reviewsStore.set((reviews) =>
                        reviews.map((item) =>
                          item.id === review.id ? { ...item, status: next } : item,
                        ),
                      );
                      notify.success(next === "Published" ? "Review published" : "Review hidden");
                    }}
                  >
                    {next === "Published" ? "Publish" : "Hide"}
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
