import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { IconButton } from "../components/icon-button";

const meta = { title: "Data Display/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Compared with last month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">€24,300</p>
        <p className="text-success-text mt-1 text-sm">+12.4%</p>
      </CardContent>
    </Card>
  ),
};

export const WithActionAndFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>3 people have access.</CardDescription>
        <CardAction>
          <IconButton label="More options">
            <MoreHorizontal />
          </IconButton>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Invite people to review reports with you.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Invite</Button>
      </CardFooter>
    </Card>
  ),
};
