import { useId, useState } from "react";
import { addHours, format } from "date-fns";
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
import { Switch } from "../../components/switch";
import { Textarea } from "../../components/textarea";
import { categories } from "./calendar-data";
import type { CalendarEvent, CategoryId } from "./calendar-data";

/** What the dialog is for: a new event with a suggested start, or an existing one. */
export type EventDraft = { event: CalendarEvent; isNew: boolean };

export const newEventAt = (start: Date): EventDraft => ({
  isNew: true,
  event: {
    id: `e${Date.now()}`,
    title: "",
    start,
    end: addHours(start, 1),
    allDay: false,
    category: "meeting",
    location: "",
    description: "",
  },
});

const toDate = (date: string, time: string) => new Date(`${date}T${time || "00:00"}`);

function EventForm({
  draft,
  onClose,
  onSave,
  onDelete,
}: Readonly<{
  draft: EventDraft;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}>) {
  const base = useId();
  const { event, isNew } = draft;
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState<CategoryId>(event.category);
  const [allDay, setAllDay] = useState(event.allDay);
  const [startDate, setStartDate] = useState(format(event.start, "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState(format(event.start, "HH:mm"));
  const [endDate, setEndDate] = useState(format(event.end, "yyyy-MM-dd"));
  const [endTime, setEndTime] = useState(format(event.end, "HH:mm"));
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [submitted, setSubmitted] = useState(false);

  const start = toDate(startDate, allDay ? "00:00" : startTime);
  const end = toDate(endDate, allDay ? "23:59" : endTime);
  const titleError = submitted && !title.trim() ? "Give the event a title." : undefined;
  const timeError =
    submitted && (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start)
      ? "The event must end after it starts."
      : undefined;

  return (
    <form
      noValidate
      className="grid grid-cols-[minmax(0,1fr)] gap-5"
      onSubmit={(submit) => {
        submit.preventDefault();
        setSubmitted(true);
        if (
          !title.trim() ||
          Number.isNaN(start.getTime()) ||
          Number.isNaN(end.getTime()) ||
          end <= start
        )
          return;
        onSave({
          ...event,
          title: title.trim(),
          category,
          allDay,
          start,
          end,
          location,
          description,
        });
        onClose();
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${base}-title`}>Title</FieldLabel>
          <Input
            id={`${base}-title`}
            autoFocus
            value={title}
            aria-invalid={Boolean(titleError)}
            onChange={(change) => setTitle(change.target.value)}
          />
          <FieldError errors={[titleError]} />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <FieldLabel htmlFor={`${base}-allday`}>All day</FieldLabel>
          <Switch id={`${base}-allday`} checked={allDay} onCheckedChange={setAllDay} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${base}-start`}>Starts</FieldLabel>
            <div className="flex gap-2">
              <Input
                id={`${base}-start`}
                type="date"
                value={startDate}
                onChange={(change) => setStartDate(change.target.value)}
              />
              {!allDay && (
                <Input
                  type="time"
                  aria-label="Start time"
                  value={startTime}
                  onChange={(change) => setStartTime(change.target.value)}
                />
              )}
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${base}-end`}>Ends</FieldLabel>
            <div className="flex gap-2">
              <Input
                id={`${base}-end`}
                type="date"
                value={endDate}
                onChange={(change) => setEndDate(change.target.value)}
              />
              {!allDay && (
                <Input
                  type="time"
                  aria-label="End time"
                  value={endTime}
                  onChange={(change) => setEndTime(change.target.value)}
                />
              )}
            </div>
          </Field>
        </div>
        <FieldError errors={[timeError]} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${base}-category`}>Category</FieldLabel>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryId)}>
              <SelectTrigger id={`${base}-category`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${base}-location`}>Location</FieldLabel>
            <Input
              id={`${base}-location`}
              value={location}
              onChange={(change) => setLocation(change.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={`${base}-description`}>Notes</FieldLabel>
          <Textarea
            id={`${base}-description`}
            rows={3}
            value={description}
            onChange={(change) => setDescription(change.target.value)}
          />
        </Field>
      </FieldGroup>
      <DialogFooter className="sm:justify-between">
        {isNew ? (
          <span />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive-text hover:text-destructive-text"
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isNew ? "Add event" : "Save"}</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

type EventDialogProps = Readonly<{
  draft: EventDraft | undefined;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}>;

export function EventDialog({ draft, onClose, onSave, onDelete }: EventDialogProps) {
  return (
    <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[min(36rem,calc(100vw-2rem))] grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>{draft?.isNew ? "New event" : "Edit event"}</DialogTitle>
          <DialogDescription>Changes are kept while you stay on this page.</DialogDescription>
        </DialogHeader>
        {draft && (
          <EventForm
            key={draft.event.id}
            draft={draft}
            onClose={onClose}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
