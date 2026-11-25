import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnalyticsDashboard } from "../pro/analytics/analytics-dashboard";
import { CrmDashboard } from "../pro/crm/crm-dashboard";
import { AuditLogPage } from "../pro/pages/audit-log-page";
import { BillingPage } from "../pro/pages/billing-page";
import { ErrorPage } from "../pro/pages/error-pages";
import { OnboardingWizard } from "../pro/pages/onboarding-wizard";
import { UsersRolesPage } from "../pro/pages/users-roles-page";
import { AppFrame } from "./app-frame";

const meta = {
  title: "Templates/Pages (Pro)",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Analytics: Story = {
  name: "Analytics dashboard",
  render: () => (
    <AppFrame>
      <AnalyticsDashboard />
    </AppFrame>
  ),
};

export const Crm: Story = {
  name: "CRM: contacts and deals pipeline",
  render: () => (
    <AppFrame>
      <CrmDashboard />
    </AppFrame>
  ),
};

export const Billing: Story = {
  name: "Billing and invoices",
  render: () => (
    <AppFrame>
      <BillingPage />
    </AppFrame>
  ),
};

export const UsersAndRoles: Story = {
  name: "Users, roles and permissions",
  render: () => (
    <AppFrame>
      <UsersRolesPage />
    </AppFrame>
  ),
};

export const AuditLog: Story = {
  name: "Audit log",
  render: () => (
    <AppFrame>
      <AuditLogPage />
    </AppFrame>
  ),
};

export const Onboarding: Story = {
  name: "Onboarding wizard",
  render: () => <OnboardingWizard />,
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground min-h-dvh p-6">
        <Story />
      </div>
    ),
  ],
};

export const NotFound: Story = { name: "Error: 404", render: () => <ErrorPage kind="404" /> };
export const ServerError: Story = { name: "Error: 500", render: () => <ErrorPage kind="500" /> };
export const Maintenance: Story = {
  name: "Maintenance",
  render: () => <ErrorPage kind="maintenance" />,
};
