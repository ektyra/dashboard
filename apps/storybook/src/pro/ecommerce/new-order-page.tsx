import { useId, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { NativeSelect } from "../../components/native-select";
import { notify } from "../../toast";
import { primaryActionClass, ProductPhoto } from "./commerce-ui";
import { paymentMethodsStore, shippingMethodsStore, storePreferences } from "./config";
import { createOrder, customersStore, effectivePrice, formatPrice, productsStore } from "./store";

export function NewOrderPage() {
  const id = useId();
  const navigate = useNavigate();
  const products = productsStore
    .use()
    .filter((product) => product.status === "Active" && product.stock > 0);
  const payments = paymentMethodsStore.use().filter((method) => method.enabled);
  const shippingMethods = shippingMethodsStore.use().filter((method) => method.enabled);
  const taxRate = Number(storePreferences.use((current) => current["tax-rate"]));
  const customers = customersStore.use();
  const [customerId, setCustomerId] = useState("");
  const defaultAddress = customers.find((customer) => customer.id === customerId)?.address;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState(payments[0]?.id ?? "");
  const [shipping, setShipping] = useState(shippingMethods[0]?.id ?? "");
  const [error, setError] = useState("");
  const subtotal = products.reduce(
    (sum, product) => sum + (quantities[product.id] ?? 0) * effectivePrice(product),
    0,
  );
  const tax = Math.round((subtotal * taxRate) / 100);
  const rate = shippingMethods.find((method) => method.id === shipping)?.rate ?? 0;

  return (
    <>
      <PageHeader
        title="Add order"
        current="Add order"
        subtitle="Create a pending demo order and reserve the selected stock."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/apps/ecommerce/orders">Cancel</Link>
            </Button>
            <Button type="submit" form={id} className={primaryActionClass}>
              <Plus aria-hidden="true" />
              Create order
            </Button>
          </>
        }
      />
      <form
        id={id}
        className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,1fr)]"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const read = (field: string) => {
            const value = data.get(field);
            return typeof value === "string" ? value.trim() : "";
          };
          const result = createOrder(
            customerId,
            payment,
            shipping,
            quantities,
            read("address"),
            read("notes"),
          );
          if (result.error) {
            setError(result.error);
            return;
          }
          if (!result.order) return;
          notify.success("Order created");
          void navigate({
            to: "/apps/ecommerce/orders/$orderId",
            params: { orderId: result.order.id },
            replace: true,
          });
        }}
      >
        <Card className="min-w-0 shadow-none">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {products.length ? (
              <ul className="divide-y divide-border">
                {products.map((product) => (
                  <li key={product.id} className="flex items-center gap-2 py-3 sm:gap-3">
                    <ProductPhoto product={product} className="hidden size-10 sm:block" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(effectivePrice(product))} · {product.stock} available
                      </p>
                    </div>
                    <Input
                      aria-label={`Quantity for ${product.name}`}
                      type="number"
                      min="0"
                      max={product.stock}
                      step="1"
                      value={quantities[product.id] ?? 0}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setQuantities((current) => ({ ...current, [product.id]: value }));
                        setError("");
                      }}
                      className="w-16"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add stock to an active product before creating an order.
              </p>
            )}
            <FieldError errors={[error]} />
          </CardContent>
        </Card>
        <Card className="min-w-0 shadow-none">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel htmlFor={`${id}-customer`}>Customer</FieldLabel>
              <NativeSelect
                id={`${id}-customer`}
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
              >
                <option value="">Choose customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-payment`}>Payment method</FieldLabel>
              <NativeSelect
                id={`${id}-payment`}
                required
                value={payment}
                onChange={(event) => setPayment(event.target.value)}
              >
                {!payments.length && <option value="">No enabled payment methods</option>}
                {payments.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-shipping`}>Shipping method</FieldLabel>
              <NativeSelect
                id={`${id}-shipping`}
                required
                value={shipping}
                onChange={(event) => setShipping(event.target.value)}
              >
                {!shippingMethods.length && <option value="">No enabled shipping methods</option>}
                {shippingMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} · {formatPrice(method.rate ?? 0)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-address`}>Shipping address</FieldLabel>
              <Textarea
                id={`${id}-address`}
                name="address"
                rows={2}
                placeholder="Street address and postal code"
                maxLength={280}
                aria-describedby={defaultAddress ? `${id}-default-address` : undefined}
              />
              {defaultAddress && (
                <FieldDescription
                  id={`${id}-default-address`}
                  className="wrap-anywhere whitespace-pre-line"
                >
                  {`Leave blank to use the saved address.\n${defaultAddress}`}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-notes`}>Delivery notes</FieldLabel>
              <Input id={`${id}-notes`} name="notes" maxLength={200} />
            </Field>
            <dl className="grid gap-2 border-t border-border pt-4 text-sm tabular-nums">
              {[
                ["Subtotal", subtotal],
                ["Shipping", rate],
                ["Tax", tax],
                ["Total", subtotal + rate + tax],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2 last:font-semibold">
                  <dt>{label}</dt>
                  <dd>{formatPrice(Number(value))}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
