import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressBookPage } from "../pro/address-book/address-book-page";
import { CalendarPage } from "../pro/calendar/calendar-page";
import { ChatPage } from "../pro/chat/chat-page";
import { CustomersPage } from "../pro/ecommerce/customers-page";
import { OrdersPage } from "../pro/ecommerce/orders-page";
import { ProductsPage } from "../pro/ecommerce/products-page";
import { ReportsPage } from "../pro/ecommerce/reports-page";
import { KanbanPage } from "../pro/kanban/kanban-page";
import { AppFrame } from "./app-frame";

const meta = {
  title: "Templates/Apps (Pro)",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Calendar: Story = {
  name: "Calendar app",
  render: () => (
    <AppFrame>
      <CalendarPage />
    </AppFrame>
  ),
};

export const Kanban: Story = {
  name: "Kanban app",
  render: () => (
    <AppFrame>
      <KanbanPage />
    </AppFrame>
  ),
};

export const Chat: Story = {
  name: "Chat app",
  render: () => (
    <AppFrame>
      <ChatPage />
    </AppFrame>
  ),
};

export const AddressBook: Story = {
  name: "Address book app",
  render: () => (
    <AppFrame>
      <AddressBookPage />
    </AppFrame>
  ),
};

export const EcommerceProducts: Story = {
  name: "E-commerce admin: products",
  render: () => (
    <AppFrame>
      <ProductsPage />
    </AppFrame>
  ),
};

export const EcommerceOrders: Story = {
  name: "E-commerce admin: orders",
  render: () => (
    <AppFrame>
      <OrdersPage />
    </AppFrame>
  ),
};

export const EcommerceCustomers: Story = {
  name: "E-commerce admin: customers",
  render: () => (
    <AppFrame>
      <CustomersPage />
    </AppFrame>
  ),
};

export const EcommerceReports: Story = {
  name: "E-commerce admin: reports",
  render: () => (
    <AppFrame>
      <ReportsPage />
    </AppFrame>
  ),
};
