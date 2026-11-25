import { useId } from "react";
import { Button } from "../../components/button";
import { Field, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { NativeSelect } from "../../components/native-select";
import { Textarea } from "../../components/textarea";
import { contactGroups, emptyContact } from "./contact-data";
import type { Contact, ContactFields } from "./contact-data";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", maxLength: 100 },
  { name: "company", label: "Company", autoComplete: "organization", maxLength: 100 },
  { name: "role", label: "Job title", autoComplete: "organization-title", maxLength: 100 },
  { name: "email", label: "Email", autoComplete: "email", type: "email", maxLength: 254 },
  { name: "phone", label: "Phone", autoComplete: "tel", type: "tel", maxLength: 50 },
] as const;

type ContactFormProps = Readonly<{
  draft: Contact | "new";
  defaultGroup: ContactFields["group"];
  onClose: () => void;
  onSave: (values: ContactFields) => void;
}>;

export function ContactForm({ draft, defaultGroup, onClose, onSave }: ContactFormProps) {
  const id = useId();
  const isNew = draft === "new";
  const values = isNew ? emptyContact : draft;

  return (
    <section
      aria-label={isNew ? "Add contact" : "Edit contact"}
      className="@container grid gap-5 p-5 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {isNew ? "Add contact" : "Edit contact"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Full name is required.</p>
      </div>
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const read = (field: keyof ContactFields) => {
            const value = data.get(field);
            return typeof value === "string" ? value.trim() : "";
          };
          const group = read("group");
          onSave({
            name: read("name"),
            company: read("company"),
            role: read("role"),
            email: read("email"),
            phone: read("phone"),
            group: contactGroups.find((option) => option === group) ?? "",
            address: read("address"),
            notes: read("notes"),
          });
        }}
      >
        <div className="grid gap-4 @sm:grid-cols-2">
          {fields.map((field) => (
            <Field
              key={field.name}
              className={field.name === "name" ? "@sm:col-span-2" : undefined}
            >
              <FieldLabel htmlFor={`${id}-${field.name}`}>{field.label}</FieldLabel>
              <Input
                id={`${id}-${field.name}`}
                name={field.name}
                type={"type" in field ? field.type : "text"}
                autoComplete={field.autoComplete}
                maxLength={field.maxLength}
                defaultValue={values[field.name]}
                autoFocus={field.name === "name"}
                required={field.name === "name"}
                pattern={field.name === "name" ? ".*\\S.*" : undefined}
              />
            </Field>
          ))}
          <Field className="@sm:col-span-2">
            <FieldLabel htmlFor={`${id}-group`}>Group</FieldLabel>
            <NativeSelect
              id={`${id}-group`}
              name="group"
              defaultValue={isNew ? defaultGroup : values.group}
            >
              <option value="">No group</option>
              {contactGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field className="@sm:col-span-2">
            <FieldLabel htmlFor={`${id}-address`}>Mailing address</FieldLabel>
            <Textarea
              id={`${id}-address`}
              name="address"
              autoComplete="street-address"
              rows={2}
              maxLength={300}
              defaultValue={values.address}
            />
          </Field>
          <Field className="@sm:col-span-2">
            <FieldLabel htmlFor={`${id}-notes`}>Notes</FieldLabel>
            <Textarea
              id={`${id}-notes`}
              name="notes"
              rows={2}
              maxLength={1000}
              defaultValue={values.notes}
            />
          </Field>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="dark:bg-primary/80 dark:hover:bg-primary/70">
            {isNew ? "Add contact" : "Save changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}
