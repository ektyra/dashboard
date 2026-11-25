import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChartColumn, CircleCheck, Clock3, Package, Plus, Truck } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Button } from "../../components/button";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { NativeSelect } from "../../components/native-select";
import { StatCard } from "../../components/stat-card";
import { TableCell, TableRow } from "../../components/table";
import {
  CommercePager,
  CommerceTable,
  DeliveryBadge,
  OrderBadge,
  primaryActionClass,
  rowLinkClass,
  SearchBox,
  useCommercePage,
} from "./commerce-ui";
import {
  customersStore,
  formatOrderDate,
  formatPrice,
  fulfillmentStatus,
  matchesSearch,
  ordersStore,
  orderTotal,
  paymentStatus,
} from "./store";

const columns = [
  { label: "Order" },
  { label: "Placed", className: "hidden lg:table-cell" },
  { label: "Customer", className: "hidden md:table-cell" },
  { label: "Payment" },
  { label: "Fulfillment", className: "hidden sm:table-cell" },
  { label: "Method", className: "hidden xl:table-cell" },
  { label: "Total", className: "text-right" },
];

export function OrdersPage({ customerId }: Readonly<{ customerId?: string }>) {
  const orders = ordersStore.use();
  const customers = customersStore.use();
  const customerById = (id: string) => customers.find((customer) => customer.id === id);
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("");
  const [delivery, setDelivery] = useState("");
  const [period, setPeriod] = useState("");
  const customer = customerId ? customerById(customerId) : undefined;
  const scoped = customer ? orders.filter((order) => order.customerId === customer.id) : orders;
  const latest = Math.max(...scoped.map((order) => Date.parse(order.placedAt.slice(0, 10))));
  const visible = scoped.filter((order) => {
    const buyer = customerById(order.customerId);
    return (
      (!payment || paymentStatus(order) === payment) &&
      (!delivery || fulfillmentStatus(order) === delivery) &&
      (!period ||
        Date.parse(order.placedAt.slice(0, 10)) >= latest - (Number(period) - 1) * 86_400_000) &&
      matchesSearch(query, `#${order.id}`, buyer?.name ?? "", buyer?.email ?? "")
    );
  });
  const pager = useCommercePage(visible.length);
  const reset = (change: (value: string) => void) => (value: string) => {
    change(value);
    pager.onPage(0);
  };

  const metrics = [
    {
      label: "Awaiting payment",
      value: scoped.filter((order) => order.status === "Pending").length,
      icon: Clock3,
      selected: payment === "Pending",
      choose: () => {
        reset(setPayment)(payment === "Pending" ? "" : "Pending");
        setDelivery("");
      },
    },
    {
      label: "To fulfill",
      value: scoped.filter((order) => order.status === "Paid").length,
      icon: Package,
      selected: payment === "Paid" && delivery === "Unfulfilled",
      choose: () => {
        const clear = payment === "Paid" && delivery === "Unfulfilled";
        reset(setPayment)(clear ? "" : "Paid");
        setDelivery(clear ? "" : "Unfulfilled");
      },
    },
    {
      label: "In transit",
      value: scoped.filter((order) => fulfillmentStatus(order) === "Shipped").length,
      icon: Truck,
      selected: delivery === "Shipped",
      choose: () => {
        reset(setDelivery)(delivery === "Shipped" ? "" : "Shipped");
        setPayment("");
      },
    },
    {
      label: "Delivered",
      value: scoped.filter((order) => fulfillmentStatus(order) === "Delivered").length,
      icon: CircleCheck,
      selected: delivery === "Delivered",
      choose: () => {
        reset(setDelivery)(delivery === "Delivered" ? "" : "Delivered");
        setPayment("");
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Review sample payments and work through fulfillment."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/dashboards/ecommerce">
                <ChartColumn aria-hidden="true" />
                Sales dashboard
              </Link>
            </Button>
            <Button className={primaryActionClass} asChild>
              <Link to="/apps/ecommerce/orders/new">
                <Plus aria-hidden="true" />
                Add order
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid min-w-0 gap-5">
        <div
          className="grid grid-cols-2 gap-3 xl:grid-cols-4"
          aria-label="Order views"
          role="group"
        >
          {metrics.map(({ label, value, icon: Icon, selected, choose }) => (
            <div key={label} className="relative min-w-0 [&>div]:h-full">
              <StatCard label={label} value={String(value)} icon={<Icon aria-hidden="true" />} />
              <button
                type="button"
                className="absolute inset-0 cursor-pointer rounded-xl outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-primary/60"
                aria-label={`Filter ${label.toLowerCase()} orders`}
                aria-pressed={selected}
                onClick={choose}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchBox
            label="Search orders"
            placeholder="Search order or customer…"
            value={query}
            onChange={reset(setQuery)}
          />
          <NativeSelect
            aria-label="Payment status"
            value={payment}
            onChange={(event) => reset(setPayment)(event.target.value)}
          >
            <option value="">All payments</option>
            {["Pending", "Paid", "Refunded"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Fulfillment status"
            value={delivery}
            onChange={(event) => reset(setDelivery)(event.target.value)}
          >
            <option value="">All fulfillment</option>
            {["Unfulfilled", "Shipped", "Delivered", "Closed"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Order date range"
            value={period}
            onChange={(event) => reset(setPeriod)(event.target.value)}
          >
            <option value="">All dates</option>
            <option value="3">Last 3 sample days</option>
            <option value="7">Last 7 sample days</option>
          </NativeSelect>
          {customer && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">{customer.name}</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/apps/ecommerce/orders">Clear customer filter</Link>
              </Button>
            </div>
          )}
        </div>
        <CommerceTable
          label="Orders"
          columns={columns}
          empty={!visible.length}
          emptyMessage="No orders match these filters."
        >
          {visible.slice(pager.page * pager.size, (pager.page + 1) * pager.size).map((order) => {
            const buyer = customerById(order.customerId);
            return (
              <TableRow key={order.id}>
                <TableCell className="max-sm:px-2">
                  <Link
                    className={rowLinkClass}
                    to="/apps/ecommerce/orders/$orderId"
                    params={{ orderId: order.id }}
                  >
                    #{order.id}
                  </Link>
                  <p className="text-xs text-muted-foreground md:hidden">{buyer?.name}</p>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                  {formatOrderDate(order.placedAt)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {buyer && (
                    <div className="flex items-center gap-2.5">
                      <Avatar aria-hidden="true">
                        <AvatarFallback>
                          {buyer.name
                            .split(" ")
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{buyer.name}</p>
                        <p className="break-all text-xs text-muted-foreground">{buyer.email}</p>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="max-sm:px-2">
                  <OrderBadge status={paymentStatus(order)} />
                  <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                    {fulfillmentStatus(order)}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <DeliveryBadge status={fulfillmentStatus(order)} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground xl:table-cell">
                  {order.paymentMethod}
                </TableCell>
                <TableCell className="text-right font-medium whitespace-nowrap tabular-nums max-sm:px-2">
                  {formatPrice(orderTotal(order))}
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
