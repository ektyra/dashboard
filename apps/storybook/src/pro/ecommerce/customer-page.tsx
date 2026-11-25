import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, UserRound } from "lucide-react";
import { useId, useState } from "react";
import { PageHeader } from "../../shell/page-header";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { EmptyState } from "../../components/empty-state";
import { Field, FieldError, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { TableCell, TableRow } from "../../components/table";
import { Textarea } from "../../components/textarea";
import { notify } from "../../toast";
import { CommerceTable, OrderBadge, primaryActionClass, rowLinkClass } from "./commerce-ui";
import type { Customer } from "./store";
import {
  customerLocation,
  customersStore,
  formatOrderDate,
  formatPrice,
  ordersStore,
  orderTotal,
  paymentStatus,
  saveCustomer,
} from "./store";

const columns = [
  { label: "Order" },
  { label: "Placed", className: "hidden sm:table-cell" },
  { label: "Payment" },
  { label: "Total", className: "text-right" },
];

export function CustomerPage({
  customerId,
  editing = false,
}: Readonly<{ customerId: string; editing?: boolean }>) {
  const customer = customersStore.use((customers) => customers.find(({ id }) => id === customerId));

  if (!customer) {
    return (
      <>
        <PageHeader title="Customer not found" current="Customer not found" />
        <EmptyState
          icon={<UserRound aria-hidden="true" />}
          title="This customer is unavailable"
          action={<BackToCustomers />}
        />
      </>
    );
  }

  return editing ? (
    <CustomerEditor key={customerId} customer={customer} />
  ) : (
    <CustomerDetails customer={customer} />
  );
}

function BackToCustomers() {
  return (
    <Button asChild variant="outline">
      <Link to="/apps/ecommerce/customers">
        <ArrowLeft aria-hidden="true" />
        Back to customers
      </Link>
    </Button>
  );
}

function CustomerDetails({ customer }: Readonly<{ customer: Customer }>) {
  const orders = ordersStore.use().filter((order) => order.customerId === customer.id);

  return (
    <>
      <PageHeader
        title={customer.name}
        current={customer.name}
        subtitle={customerLocation(customer)}
        actions={
          <>
            <BackToCustomers />
            <Button className={primaryActionClass} asChild>
              <Link
                to="/apps/ecommerce/customers/$customerId/edit"
                params={{ customerId: customer.id }}
              >
                <Pencil aria-hidden="true" />
                Edit customer
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
        <section aria-labelledby="customer-order-history" className="grid min-w-0 gap-3">
          <h2 id="customer-order-history" className="text-lg">
            Order history
          </h2>
          <CommerceTable
            label="Order history"
            columns={columns}
            empty={!orders.length}
            emptyMessage="This customer has no orders yet."
          >
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    to="/apps/ecommerce/orders/$orderId"
                    params={{ orderId: order.id }}
                    className={rowLinkClass}
                  >
                    #{order.id}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatOrderDate(order.placedAt)}
                </TableCell>
                <TableCell>
                  <OrderBadge status={paymentStatus(order)} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPrice(orderTotal(order))}
                </TableCell>
              </TableRow>
            ))}
          </CommerceTable>
        </section>
        <Card className="order-first min-w-0 shadow-none xl:order-none">
          <CardHeader>
            <CardTitle>Contact and address</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1 wrap-anywhere">{customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-1 wrap-anywhere">{customer.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Shipping address</dt>
                <dd className="mt-1 wrap-anywhere whitespace-pre-line">
                  {[customer.address, customerLocation(customer)].filter(Boolean).join("\n")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const contactFields = [
  { name: "name", label: "Full name", autoComplete: "name", type: "text", required: true },
  { name: "email", label: "Email", autoComplete: "email", type: "email", required: true },
  { name: "phone", label: "Phone", autoComplete: "tel", type: "tel", required: false },
] as const;

const locationFields = [
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "country", label: "Country", autoComplete: "country-name" },
] as const;

function CustomerEditor({ customer }: Readonly<{ customer: Customer }>) {
  const id = useId();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const detail = {
    to: "/apps/ecommerce/customers/$customerId",
    params: { customerId: customer.id },
  } as const;

  return (
    <>
      <PageHeader
        title="Edit customer"
        current="Edit customer"
        subtitle={customer.name}
        actions={
          <>
            <Button asChild variant="outline">
              <Link {...detail}>Cancel</Link>
            </Button>
            <Button type="submit" form={id} className={primaryActionClass}>
              Save changes
            </Button>
          </>
        }
      />
      <form
        id={id}
        className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2"
        onChange={() => setError("")}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const read = (name: keyof Omit<Customer, "id">) => {
            const value = data.get(name);
            return typeof value === "string" ? value.trim() : "";
          };
          const name = read("name");
          const city = read("city");
          const country = read("country");
          if (!name || !city || !country) {
            setError("Enter a full name, city, and country.");
            return;
          }

          saveCustomer(customer.id, {
            name,
            email: read("email"),
            phone: read("phone"),
            address: read("address"),
            city,
            country,
          });
          notify.success("Customer updated");
          void navigate({ ...detail, replace: true });
        }}
      >
        <Card className="min-w-0 shadow-none">
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {contactFields.map(({ name, label, autoComplete, type, required }) => (
              <Field key={name}>
                <FieldLabel htmlFor={`${id}-${name}`}>{label}</FieldLabel>
                <Input
                  id={`${id}-${name}`}
                  name={name}
                  autoComplete={autoComplete}
                  type={type}
                  defaultValue={customer[name]}
                  required={required}
                  maxLength={name === "email" ? 254 : 120}
                />
              </Field>
            ))}
          </CardContent>
        </Card>
        <Card className="min-w-0 shadow-none">
          <CardHeader>
            <CardTitle>Shipping address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel htmlFor={`${id}-address`}>Street address and postal code</FieldLabel>
              <Textarea
                id={`${id}-address`}
                name="address"
                autoComplete="street-address"
                defaultValue={customer.address}
                rows={3}
                maxLength={280}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              {locationFields.map(({ name, label, autoComplete }) => (
                <Field key={name}>
                  <FieldLabel htmlFor={`${id}-${name}`}>{label}</FieldLabel>
                  <Input
                    id={`${id}-${name}`}
                    name={name}
                    autoComplete={autoComplete}
                    defaultValue={customer[name]}
                    required
                    maxLength={120}
                  />
                </Field>
              ))}
            </div>
          </CardContent>
        </Card>
        <FieldError errors={[error]} className="xl:col-span-2" />
      </form>
    </>
  );
}
