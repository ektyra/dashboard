import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { BarChart, LineChart } from "../../widgets/charts";
import { PageHeader } from "../../shell/page-header";
import { ChartCard } from "../../components/chart-card";
import { Button } from "../../components/button";
import { NativeSelect } from "../../components/native-select";
import { StatCard } from "../../components/stat-card";
import { TableCell, TableRow } from "../../components/table";
import { CommerceTable, rowLinkClass } from "./commerce-ui";
import { downloadFile } from "../../lib/download-file";
import { dailySales, isCollected } from "./report-data";
import { formatOrderDate, formatPrice, ordersStore, orderSubtotal, productsStore } from "./store";

export function ReportsPage() {
  const orders = ordersStore.use();
  const products = productsStore.use();
  const [period, setPeriod] = useState("");
  const latestDay = Math.max(...orders.map((order) => Date.parse(order.placedAt.slice(0, 10))));
  const scope = orders.filter(
    (order) =>
      !period ||
      Date.parse(order.placedAt.slice(0, 10)) >= latestDay - (Number(period) - 1) * 86_400_000,
  );
  const days = dailySales(scope);
  const collected = scope.filter(isCollected);
  const sales = collected.reduce((sum, order) => sum + orderSubtotal(order), 0);
  const refunds = scope
    .filter((order) => order.status === "Refunded")
    .reduce((sum, order) => sum + orderSubtotal(order), 0);
  const labels = days.map((day) => day.date.slice(5).replace("-", "/"));
  const totals = products
    .map((product) => {
      const lines = collected.flatMap((order) =>
        order.lines.filter((line) => line.productId === product.id),
      );
      return {
        product,
        units: lines.reduce((sum, line) => sum + line.quantity, 0),
        sales: lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
      };
    })
    .filter((item) => item.units > 0)
    .sort((a, b) => b.sales - a.sales);

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Explore sales and order volume from the e-commerce demo."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              downloadFile(
                "commerce-sales.csv",
                [
                  "Date,Orders,Net sales (USD)",
                  ...days.map(
                    ({ date, orders, sales }) => `${date},${orders},${(sales / 100).toFixed(2)}`,
                  ),
                ].join("\n"),
                "text/csv;charset=utf-8",
              )
            }
          >
            <Download aria-hidden="true" />
            Export CSV
          </Button>
        }
      />
      <div className="grid min-w-0 gap-5">
        <div className="justify-self-start">
          <NativeSelect
            aria-label="Reporting period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="">All sample dates</option>
            <option value="7">Last 7 sample days</option>
            <option value="3">Last 3 sample days</option>
          </NativeSelect>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard label="Net product sales" value={formatPrice(sales)} />
          <StatCard label="Orders placed" value={String(scope.length)} />
          <StatCard
            label="Average paid order"
            value={formatPrice(collected.length ? Math.round(sales / collected.length) : 0)}
          />
          <StatCard label="Refunded products" value={formatPrice(refunds)} />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Net sales by order date"
            description="Paid product sales, excluding refunds, tax, and shipping."
            height={230}
            table={{
              columns: ["Date", "Net sales"],
              rows: days.map((day) => [formatOrderDate(day.date), formatPrice(day.sales)]),
            }}
          >
            <LineChart
              currency
              labels={labels}
              lines={[{ label: "Net sales", data: days.map((day) => day.sales / 100) }]}
            />
          </ChartCard>
          <ChartCard
            title="Orders by date"
            description="Orders placed, including pending and refunded orders."
            height={230}
            table={{
              columns: ["Date", "Orders"],
              rows: days.map((day) => [formatOrderDate(day.date), day.orders]),
            }}
          >
            <BarChart labels={labels} label="Orders" data={days.map((day) => day.orders)} />
          </ChartCard>
        </div>
        <section className="grid gap-3">
          <h2 className="text-lg font-semibold">Top products</h2>
          <CommerceTable
            label="Top products"
            columns={[
              { label: "Product" },
              { label: "Units" },
              { label: "Net sales", className: "text-right" },
            ]}
            empty={!totals.length}
            emptyMessage="There are no paid product sales in this period."
          >
            {totals.map(({ product, units, sales }) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    className={rowLinkClass}
                    to="/apps/ecommerce/products/$productId"
                    params={{ productId: product.id }}
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell className="tabular-nums">{units}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPrice(sales)}</TableCell>
              </TableRow>
            ))}
          </CommerceTable>
        </section>
      </div>
    </>
  );
}
