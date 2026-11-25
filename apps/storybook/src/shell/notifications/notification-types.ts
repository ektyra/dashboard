import { CalendarDays, Info, Kanban, Mail, MessageSquare, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { badgeVariants } from "../../components/badge";
import type { NavTo } from "../navigation";

export type NotificationType = "email" | "chat" | "task" | "calendar" | "system" | "order";

export type Notification = {
  id: string;
  title: string;
  text: string;
  at: Date;
  read: boolean;
  /** How many unread things this stands for (a chat with three new messages). */
  count: number;
  /** Called when the notification is clicked, before going to the page. */
  onOpen: () => void;
} & (
  | { type: Exclude<NotificationType, "order">; to: NavTo }
  | { type: "order"; to: "/apps/ecommerce/orders/$orderId"; params: { orderId: string } }
);

type Variant = NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];

/** How each kind of notification looks: its label, icon and badge colour. */
export const typeInfo: Record<
  NotificationType,
  { label: string; icon: LucideIcon; variant: Variant }
> = {
  email: { label: "Email", icon: Mail, variant: "info" },
  chat: { label: "Chat", icon: MessageSquare, variant: "success" },
  task: { label: "Task", icon: Kanban, variant: "warning" },
  calendar: { label: "Calendar", icon: CalendarDays, variant: "default" },
  system: { label: "System", icon: Info, variant: "secondary" },
  order: { label: "Order", icon: ShoppingCart, variant: "info" },
};
