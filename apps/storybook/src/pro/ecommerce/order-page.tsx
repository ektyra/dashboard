import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock3, Package, Truck } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Timeline, TimelineItem } from "../../components/timeline";
import { Button } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { TableCell, TableRow } from "../../components/table";
import { notify } from "../../toast";
import {
  CommerceTable,
  DeliveryBadge,
  OrderBadge,
  primaryActionClass,
  ProductPhoto,
  rowLinkClass,
} from "./commerce-ui";
import {
  customersStore,
  deliverOrder,
  formatOrderActivity,
  fulfillmentStatus,
  paymentStatus,
  formatOrderDate,
  formatPrice,
  ordersStore,
  orderSubtotal,
  orderTotal,
  productsStore,
  updateOrderStatus,
} from "./store";
import type { OrderStatus } from "./store";

const itemColumns = [
  { label: "Product" },
  { label: "Qty", className: "text-right" },
  { label: "Amount", className: "text-right" },
];

export function OrderPage({ orderId }: Readonly<{ orderId: string }>) {
  const order = ordersStore.use((orders) => orders.find((entry) => entry.id === orderId));
  const products = productsStore.use();
  const customer = customersStore.use((customers) =>
    customers.find(({ id }) => id === order?.customerId),
  );

  if (!order) {
    return (
      <>
        <PageHeader title="Order not found" current="Order not found" />
        <EmptyState
          icon={<Package aria-hidden="true" />}
          title="This order is unavailable"
          action={
            <Button asChild variant="outline">
              <Link to="/apps/ecommerce/orders" search={{ customer: undefined }}>
                <ArrowLeft aria-hidden="true" />
                Back to orders
              </Link>
            </Button>
          }
        />
      </>
    );
  }

  function transition(status: OrderStatus, message: string) {
    if (updateOrderStatus(orderId, status)) notify.success(message);
  }

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        current={`#${order.id}`}
        subtitle={`Placed ${formatOrderDate(order.placedAt)} · Sample order`}
        actions={
          <>
            <OrderBadge status={paymentStatus(order)} />
            <DeliveryBadge status={fulfillmentStatus(order)} />
            {order.status === "Pending" && (
              <Button
                className={primaryActionClass}
                onClick={() => transition("Paid", "Order marked as paid")}
              >
                <Check aria-hidden="true" />
                Mark as paid
              </Button>
            )}
            {(order.status === "Paid" || order.status === "Shipped") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Refund order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Refund order #{order.id}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This marks {formatPrice(orderTotal(order))} as refunded in the demo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      className="dark:bg-destructive/75 dark:hover:bg-destructive/65"
                      onClick={() => transition("Refunded", "Order refunded")}
                    >
                      Refund order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {order.status === "Paid" && (
              <Button
                className={primaryActionClass}
                onClick={() => transition("Shipped", "Order marked as shipped")}
              >
                <Truck aria-hidden="true" />
                Mark as shipped
              </Button>
            )}
            {order.status === "Shipped" && !order.deliveredAt && (
              <Button
                className={primaryActionClass}
                onClick={() => {
                  if (deliverOrder(orderId)) notify.success("Order marked as delivered");
                }}
              >
                <Check aria-hidden="true" />
                Mark as delivered
              </Button>
            )}
          </>
        }
      />
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,19rem)]">
        <div className="grid min-w-0 gap-8">
          <section className="grid min-w-0 gap-3" aria-label="Order summary">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <CommerceTable label="Order items" columns={itemColumns} empty={false} emptyMessage="">
              {order.lines.map((line) => (
                <TableRow key={line.productId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProductPhoto
                        product={products.find((product) => product.id === line.productId)}
                        className="hidden size-10 sm:block"
                      />
                      <div className="min-w-0">
                        <Link
                          className={rowLinkClass}
                          to="/apps/ecommerce/products/$productId"
                          params={{ productId: line.productId }}
                        >
                          {line.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {line.sku} · {formatPrice(line.unitPrice)} each
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                  <TableCell className="text-right whitespace-nowrap tabular-nums">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </CommerceTable>
            <dl className="ml-auto grid w-full max-w-xs gap-2 text-sm tabular-nums">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(orderSubtotal(order))}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{formatPrice(order.shipping)}</dd>
              </div>
              {Boolean(order.tax) && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd>{formatPrice(order.tax ?? 0)}</dd>
                </div>
              )}
              <div className="mt-1 flex justify-between gap-2 border-t border-border pt-3 font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(orderTotal(order))}</dd>
              </div>
            </dl>
          </section>
          <Card className="shadow-none" aria-label="Order activity">
            <CardHeader>
              <CardTitle>Order activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                {order.activity.map((event, index) => (
                  <TimelineItem
                    key={event.label}
                    title={event.label}
                    time={formatOrderActivity(event.date)}
                    icon={<Clock3 aria-hidden="true" />}
                    last={index === order.activity.length - 1}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </div>
        <aside aria-label="Customer and delivery details" className="grid min-w-0 gap-4">
          {customer && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1 text-sm">
                <Link
                  to="/apps/ecommerce/customers/$customerId"
                  params={{ customerId: customer.id }}
                  className={`justify-self-start wrap-anywhere ${rowLinkClass}`}
                >
                  {customer.name}
                </Link>
                <p className="break-words text-muted-foreground">{customer.email}</p>
                <Link
                  to="/apps/ecommerce/orders"
                  search={{ customer: customer.id }}
                  className={`mt-2 justify-self-start ${rowLinkClass}`}
                >
                  View customer orders
                </Link>
              </CardContent>
            </Card>
          )}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <p className="font-medium">{order.shippingMethod}</p>
              {order.shippingAddress && (
                <p className="break-words whitespace-pre-line text-muted-foreground">
                  {order.shippingAddress}
                </p>
              )}
              {order.shippingLocation && (
                <p className="text-muted-foreground">{order.shippingLocation}</p>
              )}
              {order.deliveryNotes && (
                <p className="rounded-md bg-warning/10 p-2.5 break-words text-warning-text">
                  {order.deliveryNotes}
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>{order.paymentMethod}</span>
              <OrderBadge status={paymentStatus(order)} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
