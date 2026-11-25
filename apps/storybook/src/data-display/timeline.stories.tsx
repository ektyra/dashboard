import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, CreditCard, Package, Truck } from "lucide-react";
import { Timeline, TimelineItem } from "../components/timeline";

const meta = { title: "Data Display/Timeline", component: Timeline } satisfies Meta<
  typeof Timeline
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Timeline className="w-80">
      <TimelineItem title="Order placed" time="Mon 09:12" icon={<Package />}>
        Order #4821 for 3 items.
      </TimelineItem>
      <TimelineItem title="Payment received" time="Mon 09:14" icon={<CreditCard />} />
      <TimelineItem title="Shipped" time="Tue 14:02" icon={<Truck />}>
        Tracking code 3SABC123.
      </TimelineItem>
      <TimelineItem title="Delivered" time="Wed 11:40" icon={<CircleCheck />} last />
    </Timeline>
  ),
};
