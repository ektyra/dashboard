import {
  Bell,
  Building2,
  CreditCard,
  DatabaseBackup,
  FileText,
  Globe,
  Palette,
  Plug,
  Settings2,
  SlidersHorizontal,
  Store,
  Tags,
  Truck,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Field = { key: string; label: string; hint?: string } & (
  | { type: "text" | "email" | "url" | "color" | "textarea" | "switch" | "tax" }
  | { type: "select"; options: string[] }
);
type Section = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  fields?: Field[];
};
export const storeSections = [
  {
    id: "general",
    label: "General info",
    description: "Name and describe your store.",
    icon: Store,
    fields: [
      { key: "store-name", label: "Store name", type: "text" },
      { key: "store-tagline", label: "Tagline", type: "text" },
    ],
  },
  {
    id: "details",
    label: "Store details",
    description: "Business contact and location.",
    icon: Building2,
    fields: [
      { key: "store-email", label: "Support email", type: "email" },
      { key: "store-city", label: "Business location", type: "text" },
    ],
  },
  {
    id: "branding",
    label: "Branding",
    description: "Storefront assets and accent color.",
    icon: Palette,
    fields: [
      { key: "brand-color", label: "Accent color", type: "color" },
      { key: "logo-url", label: "Logo URL", type: "url" },
    ],
  },
  {
    id: "product-attributes",
    label: "Product attributes",
    description: "Define the fields shown in the product editor.",
    icon: SlidersHorizontal,
  },
  {
    id: "category-attributes",
    label: "Category attributes",
    description: "Define metadata for catalog categories.",
    icon: Tags,
  },
  {
    id: "currency-tax",
    label: "Currency & tax",
    description: "Demo orders use USD. The tax rate applies to new orders.",
    icon: Wallet,
    fields: [{ key: "tax-rate", label: "Sales tax (%)", type: "tax" }],
  },
  {
    id: "shipping",
    label: "Shipping methods",
    description: "Set delivery options and rates for new orders.",
    icon: Truck,
  },
  {
    id: "payments",
    label: "Payment methods",
    description: "Choose how new demo orders can be paid.",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Configure demo message and inventory preferences.",
    icon: Bell,
    fields: [
      { key: "order-emails", label: "Order confirmation emails", type: "switch" },
      { key: "stock-alerts", label: "Low-stock alerts", type: "switch" },
    ],
  },
  {
    id: "invoices",
    label: "Invoices & receipts",
    description: "Set the prefix for new order numbers and draft a receipt footer.",
    icon: FileText,
    fields: [
      {
        key: "order-prefix",
        label: "Order number prefix",
        type: "text",
        hint: "For example, NS-.",
      },
      { key: "receipt-footer", label: "Receipt footer", type: "textarea" },
    ],
  },
  {
    id: "seo-legal",
    label: "SEO & legal",
    description: "Edit the storefront page title and return policy.",
    icon: Globe,
    fields: [
      { key: "page-title", label: "Storefront page title", type: "text" },
      { key: "returns-policy", label: "Returns policy", type: "textarea" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Store demo catalog sync preferences.",
    icon: Plug,
    fields: [
      { key: "sync-catalog", label: "Catalog sync", type: "switch" },
      { key: "webhook-url", label: "Webhook URL", type: "url" },
    ],
  },
  {
    id: "backups",
    label: "Backups",
    description: "Choose a backup schedule and export the current configuration.",
    icon: DatabaseBackup,
    fields: [
      {
        key: "backup-interval",
        label: "Backup schedule",
        type: "select",
        options: ["Daily", "Weekly", "Manual"],
      },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Storefront availability preferences.",
    icon: Settings2,
    fields: [{ key: "maintenance-mode", label: "Maintenance mode", type: "switch" }],
  },
] as const satisfies readonly Section[];

export type StoreSection = (typeof storeSections)[number]["id"];
export type StoreField = Field;
export const getStoreSection = (id: string): Section | undefined =>
  storeSections.find((section) => section.id === id);
