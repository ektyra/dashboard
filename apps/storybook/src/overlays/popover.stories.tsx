import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Button } from "../components/button";
import { Field, FieldLabel } from "../components/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/hover-card";
import { Input } from "../components/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

const meta = { title: "Overlays/Popover and HoverCard", component: Popover } satisfies Meta<
  typeof Popover
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ClickPopover: Story = {
  name: "Popover (click)",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Rename</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Field>
          <FieldLabel htmlFor="rn">Report name</FieldLabel>
          <Input id="rn" defaultValue="Q3 summary" />
        </Field>
        <Button size="sm" className="mt-3">
          Save
        </Button>
      </PopoverContent>
    </Popover>
  ),
};

export const HoverProfile: Story = {
  name: "HoverCard (hover or focus)",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="text-primary text-sm underline underline-offset-4">
          @ada
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-medium">Ada Lovelace</p>
            <p className="text-muted-foreground">Engineer. Writes the reports you read.</p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <CalendarDays className="size-3.5" /> Joined March 2024
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
