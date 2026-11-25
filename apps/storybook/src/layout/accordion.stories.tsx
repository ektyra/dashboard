import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion";
import { Button } from "../components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible";

const meta: Meta = {
  title: "Layout/Accordion and Collapsible",
  component: Accordion,
};
export default meta;

type Story = StoryObj;

const items = [
  [
    "Can I change my plan later?",
    "Yes. Change it any time in Billing; the difference is prorated.",
  ],
  ["Where is my data stored?", "In the region you chose when you created the dashboard."],
  ["Who can see my reports?", "Only people you invite, and only with the role you give them."],
];

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96" defaultValue="item-0">
      {items.map(([q, a], i) => (
        <AccordionItem key={q} value={`item-${i}`}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96" defaultValue={["item-0", "item-1"]}>
      {items.map(([q, a], i) => (
        <AccordionItem key={q} value={`item-${i}`}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const CollapsibleBlock: Story = {
  name: "Collapsible",
  render: () => (
    <Collapsible className="w-80">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">3 more filters</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle filters">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="text-muted-foreground mt-2 flex flex-col gap-1 text-sm">
          <li>Status</li>
          <li>Owner</li>
          <li>Created</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
};
