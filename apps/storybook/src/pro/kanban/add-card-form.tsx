import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";

/** A button at the bottom of a column that turns into a one-line form. */
export function AddCardForm({
  columnTitle,
  onAdd,
}: Readonly<{ columnTitle: string; onAdd: (title: string) => void }>) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus aria-hidden="true" />
        Add a card
      </Button>
    );
  }

  const close = () => {
    setOpen(false);
    setTitle("");
  };

  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        close();
      }}
    >
      <Input
        autoFocus
        value={title}
        aria-label={`New card in ${columnTitle}`}
        placeholder="What needs doing?"
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && close()}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!title.trim()}>
          Add
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
