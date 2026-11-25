import { createStore } from "../../lib/store";
import { paymentMethodsStore, shippingMethodsStore, storePreferences } from "./config";

export const productStatuses = ["Active", "Draft", "Archived"] as const;
export type Discount = { type: "percentage" | "fixed"; amount: number };

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  sellerId?: string;
  attributes?: Record<string, string>;
  status: (typeof productStatuses)[number];
  price: number;
  stock: number;
  description: string;
  brand?: string;
  subcategory?: string;
  tags?: string[];
  photo?: [column: number, row: number];
  imageUrl?: string;
  discount?: Discount;
};

const catalog = {
  tee: {
    id: "tee",
    sellerId: "northline",
    name: "Ektyra tee (M)",
    sku: "TEE-BLK-M",
    category: "Apparel",
    status: "Active",
    price: 3200,
    stock: 9,
    description: "A black cotton crew-neck in a relaxed fit.",
    photo: [0, 0],
  },
  notebooks: {
    id: "notebooks",
    sellerId: "paper-form",
    name: "Notebook set",
    sku: "NOTE-DUO",
    category: "Stationery",
    status: "Active",
    price: 2400,
    stock: 4,
    description: "Two clothbound notebooks with lay-flat binding and unlined pages.",
    photo: [1, 0],
  },
  plant: {
    id: "plant",
    sellerId: "fieldwork",
    name: "Desk plant",
    sku: "PLANT-SAND",
    category: "Desk accessories",
    status: "Active",
    price: 3800,
    stock: 14,
    description: "A pothos in a sand-colored ceramic planter.",
    photo: [2, 0],
  },
  stickers: {
    id: "stickers",
    sellerId: "paper-form",
    name: "Sticker pack",
    sku: "STICKER-03",
    category: "Stationery",
    status: "Active",
    price: 800,
    stock: 31,
    description: "Three die-cut vinyl stickers with abstract studio artwork.",
    photo: [0, 1],
  },
  tote: {
    id: "tote",
    sellerId: "northline",
    name: "Canvas tote",
    sku: "TOTE-NAT",
    category: "Apparel",
    status: "Active",
    price: 2800,
    stock: 0,
    description: "A heavyweight natural canvas tote with reinforced handles.",
    photo: [1, 1],
  },
  mug: {
    id: "mug",
    sellerId: "fieldwork",
    name: "Ceramic mug",
    sku: "MUG-LILAC",
    category: "Desk accessories",
    status: "Draft",
    price: 2200,
    stock: 18,
    description: "A matte lavender ceramic mug with a generous handle.",
    photo: [2, 1],
  },
} satisfies Record<string, Product>;

export const productsStore = createStore<Product[]>(Object.values(catalog));
let nextProductId = 1;

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  country: string;
};

export const customersStore = createStore<Customer[]>([
  {
    id: "maya",
    name: "Maya Visser",
    email: "maya@northwind.example",
    city: "London",
    country: "United Kingdom",
  },
  {
    id: "noah",
    name: "Noah de Boer",
    email: "noah.deboer@example.com",
    city: "Rotterdam",
    country: "Netherlands",
  },
  {
    id: "lena",
    name: "Lena Fischer",
    email: "lena.fischer@example.com",
    city: "Hamburg",
    country: "Germany",
  },
  {
    id: "tom",
    name: "Tom Bakker",
    email: "tom.bakker@example.com",
    city: "Utrecht",
    country: "Netherlands",
  },
  {
    id: "iris",
    name: "Iris Jansen",
    email: "iris.jansen@example.com",
    city: "Amsterdam",
    country: "Netherlands",
  },
  {
    id: "sven",
    name: "Sven Mulder",
    email: "sven.mulder@example.com",
    city: "Antwerp",
    country: "Belgium",
  },
  {
    id: "elena",
    name: "Elena Ruiz",
    email: "elena.ruiz@example.com",
    city: "Valencia",
    country: "Spain",
  },
  {
    id: "camille",
    name: "Camille Laurent",
    email: "camille.laurent@example.com",
    city: "Lyon",
    country: "France",
  },
  {
    id: "amina",
    name: "Amina Brooks",
    email: "amina.brooks@example.com",
    city: "San Francisco",
    country: "United States",
  },
]);

const customerById = (id: string) => customersStore.get().find((customer) => customer.id === id);

export function saveCustomer(id: string, details: Omit<Customer, "id">) {
  customersStore.set((customers) =>
    customers.map((customer) => (customer.id === id ? { ...customer, ...details } : customer)),
  );
}

export const customerLocation = (customer: Customer) => `${customer.city}, ${customer.country}`;

export type OrderStatus = "Pending" | "Paid" | "Shipped" | "Refunded";
export type OrderLine = {
  productId: string;
  sellerId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};
export type Order = {
  id: string;
  customerId: Customer["id"];
  placedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  shipping: number;
  tax?: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress?: string;
  shippingLocation?: string;
  deliveryNotes?: string;
  shippedAt?: string;
  deliveredAt?: string;
  reservedStock?: boolean;
  activity: { label: string; date: string }[];
};

const statusEvent: Record<OrderStatus, string> = {
  Pending: "Order placed",
  Paid: "Payment marked as received",
  Shipped: "Order marked as shipped",
  Refunded: "Order marked as refunded",
};

type Item = [product: keyof typeof catalog, quantity: number];

function demoOrder(
  id: number,
  customerId: Customer["id"],
  day: number,
  status: OrderStatus,
  items: Item[],
  shipping = 600,
): Order {
  const placedAt = new Date(Date.UTC(2026, 10, day, 10 + (id % 9), 15)).toISOString();
  const shippedAt =
    status === "Shipped" ? new Date(Date.parse(placedAt) + 2 * 3_600_000).toISOString() : undefined;
  const deliveredAt =
    shippedAt && day < 17 ? new Date(Date.parse(shippedAt) + 86_400_000).toISOString() : undefined;
  const customer = customerById(customerId);
  return {
    id: String(id),
    customerId,
    placedAt,
    status,
    lines: items.map(([key, quantity]) => {
      const { id: productId, sellerId, sku, name, price } = catalog[key];
      return { productId, sellerId, sku, name, quantity, unitPrice: price };
    }),
    shipping,
    shippingLocation: customer && customerLocation(customer),
    shippingMethod: shipping >= 1000 ? "Express delivery" : "Standard delivery",
    paymentMethod: status === "Pending" ? "Bank transfer" : "Card",
    shippedAt,
    deliveredAt,
    activity: [
      ...(deliveredAt ? [{ label: "Order marked as delivered", date: deliveredAt }] : []),
      ...(status !== "Pending"
        ? [{ label: statusEvent[status], date: shippedAt ?? placedAt }]
        : []),
      { label: statusEvent.Pending, date: placedAt },
    ],
  };
}

const sampleOrders = [
  demoOrder(
    10428,
    "maya",
    18,
    "Paid",
    [
      ["tee", 2],
      ["stickers", 2],
    ],
    400,
  ),
  demoOrder(
    10427,
    "noah",
    18,
    "Shipped",
    [
      ["plant", 2],
      ["notebooks", 2],
    ],
    800,
  ),
  demoOrder(10426, "lena", 17, "Pending", [["plant", 1]], 800),
  demoOrder(
    10425,
    "tom",
    17,
    "Paid",
    [
      ["tee", 4],
      ["notebooks", 2],
      ["tote", 1],
      ["stickers", 1],
    ],
    700,
  ),
  demoOrder(10424, "iris", 16, "Refunded", [
    ["notebooks", 1],
    ["tote", 1],
  ]),
  demoOrder(
    10423,
    "sven",
    16,
    "Shipped",
    [
      ["tee", 2],
      ["tote", 1],
    ],
    500,
  ),
  demoOrder(10422, "elena", 15, "Paid", [
    ["notebooks", 1],
    ["stickers", 3],
  ]),
  demoOrder(10421, "camille", 14, "Pending", [
    ["tee", 1],
    ["notebooks", 1],
  ]),
  demoOrder(
    10420,
    "amina",
    14,
    "Shipped",
    [
      ["notebooks", 2],
      ["tote", 2],
    ],
    1200,
  ),
  demoOrder(10419, "maya", 13, "Shipped", [["plant", 2]]),
  demoOrder(10418, "iris", 12, "Shipped", [["stickers", 6]]),
  demoOrder(10417, "camille", 11, "Shipped", [
    ["tee", 1],
    ["notebooks", 2],
  ]),
];

export const ordersStore = createStore(sampleOrders);
const sampleOrderIds = new Set(sampleOrders.map((order) => order.id));

export function useNewOrders() {
  return ordersStore.use().filter((order) => !sampleOrderIds.has(order.id));
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Paid"],
  Paid: ["Shipped", "Refunded"],
  Shipped: ["Refunded"],
  Refunded: [],
};

export function updateOrderStatus(id: string, status: OrderStatus) {
  const current = ordersStore.get().find((order) => order.id === id);
  if (!current || !transitions[current.status].includes(status)) return false;

  const now = new Date().toISOString();
  if (status === "Refunded" && current.reservedStock && !current.shippedAt) {
    productsStore.set((products) =>
      products.map((product) => {
        const line = current.lines.find((item) => item.productId === product.id);
        return line ? { ...product, stock: product.stock + line.quantity } : product;
      }),
    );
  }

  ordersStore.set((orders) =>
    orders.map((order) =>
      order.id === id
        ? {
            ...order,
            status,
            shippedAt: status === "Shipped" ? now : order.shippedAt,
            activity: [{ label: statusEvent[status], date: now }, ...order.activity],
          }
        : order,
    ),
  );
  return true;
}

export function saveProduct(id: string | undefined, details: Omit<Product, "id">) {
  const products = productsStore.get();
  if (
    products.some(
      (product) => product.id !== id && product.sku.toLowerCase() === details.sku.toLowerCase(),
    )
  ) {
    return undefined;
  }
  const existing = products.find((product) => product.id === id);
  if (id && !existing) return undefined;
  const product = { ...details, id: id ?? `product-${nextProductId++}` };
  productsStore.set(
    existing
      ? products.map((entry) => (entry.id === id ? product : entry))
      : [...products, product],
  );
  return product;
}

export const orderSubtotal = (order: Order) =>
  order.lines.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
export const orderTotal = (order: Order) =>
  orderSubtotal(order) + order.shipping + (order.tax ?? 0);

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export const formatPrice = (cents: number) => currency.format(cents / 100);
export const formatOrderDate = (value: string) => date.format(new Date(value));

export function effectivePrice({ price, discount }: Product) {
  if (!discount) return price;
  const reduction =
    discount.type === "fixed" ? discount.amount : Math.round((price * discount.amount) / 100);
  return Math.max(0, price - reduction);
}

export function matchesSearch(query: string, ...values: string[]) {
  const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const haystack = normalize(values.join(" "));
  return normalize(query.trim())
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export function paymentStatus(order: Order) {
  return order.status === "Pending" || order.status === "Refunded" ? order.status : "Paid";
}

export function fulfillmentStatus(order: Order) {
  if (order.deliveredAt) return "Delivered";
  if (order.shippedAt) return "Shipped";
  return order.status === "Refunded" ? "Closed" : "Unfulfilled";
}

export function deliverOrder(id: string) {
  const order = ordersStore.get().find((item) => item.id === id);
  if (order?.status !== "Shipped" || order.deliveredAt) return false;
  const date = new Date().toISOString();
  ordersStore.set((orders) =>
    orders.map((item) =>
      item.id === id
        ? {
            ...item,
            deliveredAt: date,
            activity: [{ label: "Order marked as delivered", date }, ...item.activity],
          }
        : item,
    ),
  );
  return true;
}

let nextOrderNumber = 10429;
export function createOrder(
  customerId: Customer["id"],
  paymentId: string,
  shippingId: string,
  quantities: Record<string, number>,
  shippingAddress: string,
  deliveryNotes: string,
) {
  const customer = customerById(customerId);
  if (!customer) return { error: "Select a customer for the order." } as const;

  const payment = paymentMethodsStore
    .get()
    .find((method) => method.id === paymentId && method.enabled);
  const delivery = shippingMethodsStore
    .get()
    .find((method) => method.id === shippingId && method.enabled);
  if (!payment || !delivery)
    return { error: "Select an enabled payment and shipping method." } as const;

  const products = productsStore.get();
  const lines: OrderLine[] = [];
  for (const [id, quantity] of Object.entries(quantities)) {
    if (quantity === 0) continue;
    const product = products.find((item) => item.id === id);
    if (
      !product ||
      product.status !== "Active" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > product.stock
    ) {
      return {
        error: "Check that the selected products are active and have enough stock.",
      } as const;
    }
    lines.push({
      productId: id,
      sellerId: product.sellerId,
      sku: product.sku,
      name: product.name,
      unitPrice: effectivePrice(product),
      quantity,
    });
  }
  if (!lines.length) return { error: "Add at least one product to the order." } as const;

  const placedAt = new Date().toISOString();
  const prefix = String(storePreferences.get()["order-prefix"] ?? "").trim();
  const order: Order = {
    id: `${prefix}${nextOrderNumber++}`,
    customerId,
    status: "Pending",
    placedAt,
    paymentMethod: payment.name,
    shippingMethod: delivery.name,
    shippingAddress: shippingAddress || customer.address,
    shippingLocation: customerLocation(customer),
    deliveryNotes,
    shipping: delivery.rate ?? 0,
    tax: Math.round(
      (lines.reduce((total, line) => total + line.quantity * line.unitPrice, 0) *
        Number(storePreferences.get()["tax-rate"] ?? 0)) /
        100,
    ),
    lines,
    reservedStock: true,
    activity: [{ label: statusEvent.Pending, date: placedAt }],
  };
  productsStore.set(
    products.map((product) => ({
      ...product,
      stock: product.stock - (quantities[product.id] ?? 0),
    })),
  );
  ordersStore.set((orders) => [order, ...orders]);
  return { order } as const;
}

const activityDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
export const formatOrderActivity = (value: string) => activityDate.format(new Date(value));
