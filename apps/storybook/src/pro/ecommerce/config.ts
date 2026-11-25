import { createStore } from "../../lib/store";

export type Category = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  subcategories: string[];
  attributes: Record<string, string>;
};

export const categoriesStore = createStore<Category[]>([
  {
    id: "Apparel",
    name: "Apparel",
    slug: "apparel",
    active: true,
    subcategories: ["T-shirts", "Bags"],
    attributes: { collection: "Everyday" },
  },
  {
    id: "Stationery",
    name: "Stationery",
    slug: "stationery",
    active: true,
    subcategories: ["Notebooks", "Stickers"],
    attributes: { collection: "Studio supplies" },
  },
  {
    id: "Desk accessories",
    name: "Desk accessories",
    slug: "desk-accessories",
    active: true,
    subcategories: ["Plants", "Drinkware"],
    attributes: {},
  },
  {
    id: "Studio gifts",
    name: "Studio gifts",
    slug: "studio-gifts",
    active: false,
    subcategories: ["Gift sets"],
    attributes: {},
  },
]);

export type Attribute = { id: string; name: string; options: string[] };
export const productAttributesStore = createStore<Attribute[]>([
  { id: "material", name: "Material", options: [] },
  { id: "finish", name: "Finish", options: ["Matte", "Glossy", "Natural"] },
]);
export const categoryAttributesStore = createStore<Attribute[]>([
  { id: "collection", name: "Collection", options: [] },
  { id: "season", name: "Season", options: ["Year-round", "Spring / Summer", "Autumn / Winter"] },
]);

export type Method = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rate?: number;
};
export const paymentMethodsStore = createStore<Method[]>([
  { id: "card", name: "Card", description: "Record a demo card payment.", enabled: true },
  {
    id: "bank",
    name: "Bank transfer",
    description: "Confirm payment after the transfer arrives.",
    enabled: true,
  },
  {
    id: "pickup",
    name: "Pay on pickup",
    description: "Record payment when the order is collected.",
    enabled: false,
  },
]);
export const shippingMethodsStore = createStore<Method[]>([
  {
    id: "standard",
    name: "Standard delivery",
    description: "Delivery in 3–5 business days.",
    enabled: true,
    rate: 600,
  },
  {
    id: "express",
    name: "Express delivery",
    description: "Delivery in 1–2 business days.",
    enabled: true,
    rate: 1200,
  },
  {
    id: "pickup",
    name: "Studio pickup",
    description: "Collect the order from the studio.",
    enabled: true,
    rate: 0,
  },
]);

export const storePreferences = createStore<Record<string, string | boolean>>({
  "store-name": "Northline Studio Shop",
  "store-tagline": "Everyday goods for work and home",
  "store-email": "shop@example.com",
  "store-city": "Amsterdam, Netherlands",
  "brand-color": "#6041ec",
  "logo-url": "",
  "tax-rate": "0",
  "order-emails": true,
  "stock-alerts": true,
  "order-prefix": "",
  "receipt-footer": "Thanks for shopping with us.",
  "page-title": "Northline Studio Shop",
  "returns-policy": "Contact the studio within 30 days to discuss a return.",
  "sync-catalog": false,
  "webhook-url": "",
  "backup-interval": "Weekly",
  "maintenance-mode": false,
});

let sequence = 0;
export const nextConfigId = (prefix: string) => `${prefix}-${++sequence}`;
export const splitList = (value: string) => [
  ...new Set(
    value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  ),
];
export const withRecord = <T extends { id: string }>(items: T[], entry: T) =>
  items.some((item) => item.id === entry.id)
    ? items.map((item) => (item.id === entry.id ? entry : item))
    : [...items, entry];
