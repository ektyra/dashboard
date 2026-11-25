import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, FileText, Settings, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/command";
import { Kbd } from "../components/kbd";

const meta = { title: "Extras/Command", component: Command } satisfies Meta<typeof Command>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <CommandEmpty>Nothing found.</CommandEmpty>
    <CommandGroup heading="Pages">
      <CommandItem>
        <FileText /> Reports
      </CommandItem>
      <CommandItem>
        <Calendar /> Calendar
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Account">
      <CommandItem>
        <User /> Profile <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <Settings /> Settings <CommandShortcut>⌘,</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </>
);

export const Inline: Story = {
  render: () => (
    <Command className="border-border w-80 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>{items}</CommandList>
    </Command>
  ),
};

export const AsDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open palette <Kbd>⌘K</Kbd>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search…" />
          <CommandList>{items}</CommandList>
        </CommandDialog>
      </>
    );
  },
};
