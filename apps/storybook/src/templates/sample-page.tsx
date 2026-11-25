import { CreditCard, ShoppingCart, Users } from "lucide-react";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { StatCard } from "../components/stat-card";
import { PageHeader } from "../shell/page-header";

/** A small page used to show the layout around it. */
export function SamplePage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="How the business is doing."
        actions={<Button>New report</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue"
          value="€24,300"
          change={12.4}
          changeLabel="vs last month"
          icon={<CreditCard />}
        />
        <StatCard
          label="Orders"
          value="1,284"
          change={4.1}
          changeLabel="vs last month"
          icon={<ShoppingCart />}
        />
        <StatCard
          label="Customers"
          value="842"
          change={-1.8}
          changeLabel="vs last month"
          icon={<Users />}
        />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content area</CardTitle>
          <CardDescription>
            Everything the page shows sits here, whichever layout is chosen.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Resize the viewport (toolbar) to see how the menu collapses on small screens.
        </CardContent>
      </Card>
    </>
  );
}
