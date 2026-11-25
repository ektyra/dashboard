import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/button";
import { StatCard } from "../components/stat-card";
import { PageHeader } from "../shell/page-header";
import { ActivityFeed } from "../widgets/activity-feed";
import { BarChart, DonutChart, LineChart } from "../widgets/charts";
import { DashboardCard } from "../widgets/dashboard-card";
import { HeroCard } from "../widgets/hero-card";
import { RangeSelect, type Range } from "../widgets/range-select";
import { RankedList } from "../widgets/ranked-list";
import { AppFrame } from "./app-frame";

const meta = {
  title: "Templates/Dashboard",
  parameters: { layout: "fullscreen", initialPath: "/" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const days = (n: number) => Array.from({ length: n }, (_, i) => `D${i + 1}`);
const wave = (n: number, base: number, amp: number) =>
  Array.from({ length: n }, (_, i) => Math.round(base + Math.sin(i / 2.2) * amp + i * 3));

function Page() {
  const [range, setRange] = useState<Range>(30);
  return (
    <AppFrame>
      <PageHeader
        title="Dashboard"
        subtitle="How the business is doing."
        actions={<Button>New report</Button>}
      />
      <div className="grid gap-6">
        <HeroCard
          title="Good morning, Ada"
          description="Revenue is up 12% on last month. Three invoices need attention."
          illustration="mountains"
          actions={<Button variant="secondary">Review invoices</Button>}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Revenue"
            value="€24,300"
            change={12.4}
            changeLabel="vs last month"
            icon={<CreditCard />}
            trend={wave(12, 40, 8)}
          />
          <StatCard
            label="Orders"
            value="1,284"
            change={4.1}
            changeLabel="vs last month"
            icon={<ShoppingCart />}
            trend={wave(12, 30, 6)}
          />
          <StatCard
            label="Customers"
            value="842"
            change={-1.8}
            changeLabel="vs last month"
            icon={<Users />}
            trend={wave(12, 50, -5)}
          />
          <StatCard
            label="Conversion"
            value="3.6%"
            change={0.6}
            changeLabel="vs last month"
            icon={<TrendingUp />}
            trend={wave(12, 20, 4)}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardCard
            title="Revenue"
            description="Daily revenue"
            action={<RangeSelect value={range} onChange={setRange} />}
            className="lg:col-span-2"
            contentClassName="h-72"
          >
            <LineChart
              labels={days(range)}
              lines={[
                { label: "This period", data: wave(range, 400, 80) },
                { label: "Previous", data: wave(range, 350, 60) },
              ]}
              currency
            />
          </DashboardCard>
          <DashboardCard title="Sales by channel" contentClassName="h-72">
            <DonutChart
              items={[
                { name: "Online", value: 540 },
                { name: "Retail", value: 320 },
                { name: "Partners", value: 180 },
              ]}
              totalLabel="Orders"
            />
          </DashboardCard>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardCard title="Top products">
            <RankedList
              items={[
                { label: "Starter plan", value: 420, display: "420" },
                { label: "Team plan", value: 310, display: "310" },
                { label: "Add-on: SSO", value: 120, display: "120" },
              ]}
            />
          </DashboardCard>
          <DashboardCard title="Signups per weekday" contentClassName="h-56">
            <BarChart
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              data={[34, 41, 38, 52, 47, 18, 12]}
              label="Signups"
              integers
            />
          </DashboardCard>
          <DashboardCard
            title="Recent activity"
            action={
              <Button variant="link" size="sm">
                View all
              </Button>
            }
          >
            <ActivityFeed
              items={[
                { name: "Grace", initials: "GH", text: "paid invoice INV-004", time: "5 min ago" },
                { name: "Alan", initials: "AT", text: "invited 3 people", time: "1 hour ago" },
                { name: "Linus", initials: "LT", text: "published a report", time: "Yesterday" },
              ]}
            />
          </DashboardCard>
        </div>
      </div>
    </AppFrame>
  );
}

export const Default: Story = { render: () => <Page /> };
