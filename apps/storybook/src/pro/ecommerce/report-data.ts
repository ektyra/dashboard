import { orderSubtotal } from "./store";
import type { Order, OrderLine } from "./store";

export const isCollected = (order: Order) => order.status === "Paid" || order.status === "Shipped";

export function calendarDays(dates: Iterable<string>) {
  const sorted = [...dates].sort();
  const first = sorted[0];
  const last = sorted.at(-1);
  if (!first || !last) return [];

  const start = Date.parse(first);
  const count = (Date.parse(last) - start) / 86_400_000 + 1;
  return Array.from({ length: count }, (_, day) =>
    new Date(start + day * 86_400_000).toISOString().slice(0, 10),
  );
}

export function dailySales(orders: Order[], includes: (line: OrderLine) => boolean = () => true) {
  const days = new Map<string, { orders: number; sales: number }>();
  for (const order of orders) {
    const key = order.placedAt.slice(0, 10);
    const current = days.get(key) ?? { orders: 0, sales: 0 };
    current.orders += 1;
    if (isCollected(order))
      current.sales += order.lines
        .filter(includes)
        .reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    days.set(key, current);
  }
  return calendarDays(days.keys()).map((date) => ({
    date,
    ...(days.get(date) ?? { orders: 0, sales: 0 }),
  }));
}

export function sellerStats(id: string, orders: Order[]) {
  const related = orders.filter((order) => order.lines.some((line) => line.sellerId === id));
  const sales = related
    .filter(isCollected)
    .reduce(
      (total, order) =>
        total +
        orderSubtotal({ ...order, lines: order.lines.filter((line) => line.sellerId === id) }),
      0,
    );
  return { related, sales };
}
