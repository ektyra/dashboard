import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import { Field, FieldLabel } from "../components/field";
import { Input } from "../components/input";

const meta = { title: "Overlays/Modal and Dialog", component: Dialog } satisfies Meta<
  typeof Dialog
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change how you appear to your team.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dn">Display name</FieldLabel>
          <Input id="dn" defaultValue="Ada Lovelace" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite your team</DialogTitle>
          <DialogDescription>They get an email with a link to join.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Terms of use</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of use</DialogTitle>
          <DialogDescription>Please read before continuing.</DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground max-h-64 space-y-3 overflow-y-auto pr-2 text-sm">
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i}>
              Clause {i + 1}. Short, plain sentences that say what you can do and what we do in
              return.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
