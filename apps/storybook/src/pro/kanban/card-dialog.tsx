import { useId, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { Textarea } from "../../components/textarea";
import { labels, members, priorities } from "./kanban-data";
import type { Card, Label, Priority } from "./kanban-data";

type CardDialogProps = Readonly<{
  card: Card | undefined;
  /** A card that does not exist yet: the dialog says "New task" and has no delete button. */
  isNew?: boolean;
  onClose: () => void;
  onSave: (card: Card) => void;
  onDelete?: (id: string) => void;
}>;

const NONE = "none";

function CardForm({
  card,
  isNew,
  onClose,
  onSave,
  onDelete,
}: Readonly<Omit<CardDialogProps, "card"> & { card: Card }>) {
  const base = useId();
  const [draft, setDraft] = useState(card);
  const [touched, setTouched] = useState(false);
  const error = touched && !draft.title.trim() ? "Give the card a title." : undefined;
  const set = <K extends keyof Card>(key: K, value: Card[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form
      noValidate
      className="grid grid-cols-[minmax(0,1fr)] gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!draft.title.trim()) return;
        onSave({ ...draft, title: draft.title.trim() });
        onClose();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${base}-title`}>Title</FieldLabel>
          <Input
            id={`${base}-title`}
            value={draft.title}
            aria-invalid={Boolean(error)}
            onChange={(event) => set("title", event.target.value)}
            onBlur={() => setTouched(true)}
          />
          <FieldError errors={[error]} />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${base}-description`}>Description</FieldLabel>
          <Textarea
            id={`${base}-description`}
            rows={3}
            value={draft.description}
            onChange={(event) => set("description", event.target.value)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${base}-label`}>Label</FieldLabel>
            <Select value={draft.label} onValueChange={(value) => set("label", value as Label)}>
              <SelectTrigger id={`${base}-label`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {labels.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${base}-priority`}>Priority</FieldLabel>
            <Select
              value={draft.priority}
              onValueChange={(value) => set("priority", value as Priority)}
            >
              <SelectTrigger id={`${base}-priority`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${base}-assignee`}>Assigned to</FieldLabel>
            <Select
              value={draft.assigneeId ?? NONE}
              onValueChange={(value) => set("assigneeId", value === NONE ? undefined : value)}
            >
              <SelectTrigger id={`${base}-assignee`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Nobody</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${base}-due`}>Due date</FieldLabel>
            <Input
              id={`${base}-due`}
              type="date"
              value={draft.due ?? ""}
              onChange={(event) => set("due", event.target.value || undefined)}
            />
          </Field>
        </div>
      </FieldGroup>
      <DialogFooter className="sm:justify-between">
        {isNew || !onDelete ? (
          <span />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive-text hover:text-destructive-text"
            onClick={() => {
              onDelete(card.id);
              onClose();
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete card
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isNew ? "Add task" : "Save"}</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

/** Opens a card to change its details or delete it. */
export function CardDialog({ card, isNew, onClose, onSave, onDelete }: CardDialogProps) {
  return (
    <Dialog open={Boolean(card)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[min(34rem,calc(100vw-2rem))] grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>{isNew ? "New task" : "Edit card"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "It is added to the Backlog on the Kanban board."
              : "Changes are kept until you reload the page."}
          </DialogDescription>
        </DialogHeader>
        {card && (
          <CardForm
            key={card.id}
            card={card}
            isNew={isNew}
            onClose={onClose}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
