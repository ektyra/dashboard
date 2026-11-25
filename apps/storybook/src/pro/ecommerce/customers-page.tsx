import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Pencil } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Button } from "../../components/button";
import { TableCell, TableRow } from "../../components/table";
import { CommerceTable, rowLinkClass, SearchBox } from "./commerce-ui";
import {
  customerLocation,
  customersStore,
  formatPrice,
  matchesSearch,
  ordersStore,
  orderTotal,
} from "./store";

const columns = [
  { label: "Customer" },
  { label: "Location", className: "hidden lg:table-cell" },
  { label: "Orders", className: "text-right" },
  { label: "Net order value", className: "hidden text-right md:table-cell" },
  { label: "Actions", className: "text-right" },
];

export function CustomersPage() {
  const orders = ordersStore.use();
  const [query, setQuery] = useState("");
  const visible = customersStore
    .use()
    .filter((customer) =>
      matchesSearch(query, customer.name, customer.email, customer.city, customer.country),
    );

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage customer details and review their order history."
      />
      <div className="grid min-w-0 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBox
            label="Search customers"
            placeholder="Search name, email, or location…"
            value={query}
            onChange={setQuery}
          />
          <p className="ml-auto text-sm text-muted-foreground" role="status">
            {visible.length} {visible.length === 1 ? "customer" : "customers"}
          </p>
        </div>
        <CommerceTable
          label="Customers"
          columns={columns}
          empty={!visible.length}
          emptyMessage="No customers match this search."
        >
          {visible.map((customer) => {
            const history = orders.filter((order) => order.customerId === customer.id);
            const paidTotal = history.reduce(
              (total, order) =>
                total +
                (order.status === "Paid" || order.status === "Shipped" ? orderTotal(order) : 0),
              0,
            );
            const initials = customer.name
              .split(" ")
              .map((word) => word[0])
              .filter(Boolean)
              .join("")
              .slice(0, 2);
            return (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar aria-hidden="true" className="hidden size-9 sm:flex">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link
                        to="/apps/ecommerce/customers/$customerId"
                        params={{ customerId: customer.id }}
                        className={rowLinkClass}
                      >
                        {customer.name}
                      </Link>
                      <p className="text-xs break-all text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{customerLocation(customer)}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Link
                    to="/apps/ecommerce/orders"
                    search={{ customer: customer.id }}
                    className={`inline-flex items-center gap-1.5 ${rowLinkClass}`}
                    aria-label={`View orders for ${customer.name}`}
                  >
                    {history.length}
                    <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </TableCell>
                <TableCell className="hidden text-right whitespace-nowrap tabular-nums md:table-cell">
                  {formatPrice(paidTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" aria-label={`Edit ${customer.name}`}>
                    <Link
                      to="/apps/ecommerce/customers/$customerId/edit"
                      params={{ customerId: customer.id }}
                    >
                      <Pencil aria-hidden="true" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </CommerceTable>
      </div>
    </>
  );
}
