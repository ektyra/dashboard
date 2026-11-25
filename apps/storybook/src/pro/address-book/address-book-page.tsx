import { useRef, useState } from "react";
import { BookUser, Search, Star, UserRoundPlus } from "lucide-react";
import { PageHeader } from "../../shell/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/alert-dialog";
import { Button } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { InputGroup, InputGroupIcon, InputGroupInput } from "../../components/input-group";
import { NativeSelect } from "../../components/native-select";
import { cn } from "../../lib/cn";
import { notify } from "../../toast";
import { ContactAvatar, ContactDetails } from "./contact-details";
import { contactGroups, contactsStore } from "./contact-data";
import type { Contact, ContactFields, ContactGroup } from "./contact-data";
import { ContactForm } from "./contact-form";

const alphabet = new Intl.Collator("en", { sensitivity: "base" });
let nextContactId = 1;
const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

function matchesContact(
  contact: Contact,
  query: string,
  favorites: boolean,
  group: ContactGroup | "",
) {
  if ((favorites && !contact.favorite) || (group && contact.group !== group)) return false;
  const searchable = [contact.name, contact.company, contact.email, contact.phone, contact.role];
  return normalize(query.trim())
    .split(/\s+/)
    .every((term) => searchable.some((field) => normalize(field).includes(term)));
}

function groupByInitial(contacts: Contact[]) {
  const groups = new Map<string, Contact[]>();
  for (const contact of [...contacts].sort((a, b) => alphabet.compare(a.name, b.name))) {
    const initial = Array.from(normalize(contact.name).toUpperCase())[0] ?? "#";
    const section = groups.get(initial);
    if (section) section.push(contact);
    else groups.set(initial, [contact]);
  }
  return groups;
}

export function AddressBookPage() {
  const contacts = contactsStore.use();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(false);
  const [group, setGroup] = useState<ContactGroup | "">("");
  const [selectedId, setSelectedId] = useState<string>();
  const [draft, setDraft] = useState<Contact | "new" | null>(null);
  const [deleting, setDeleting] = useState<Contact>();
  const searchRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);
  const dialogTrigger = useRef<HTMLButtonElement>(null);

  const filtered = contacts.filter((contact) => matchesContact(contact, query, favorites, group));
  const grouped = groupByInitial(filtered);
  const selected = filtered.find((contact) => contact.id === selectedId);
  const active = selected ?? grouped.values().next().value?.[0];
  const hasFilters = Boolean(query.trim() || favorites || group);

  function clearFilters() {
    setQuery("");
    setFavorites(false);
    setGroup("");
    setSelectedId(undefined);
  }

  function saveContact(values: ContactFields) {
    if (!draft) return;
    const isNew = draft === "new";
    const contact: Contact = {
      ...values,
      id: isNew ? `contact-${nextContactId++}` : draft.id,
      favorite: !isNew && draft.favorite,
    };
    contactsStore.set((current) =>
      isNew
        ? [...current, contact]
        : current.map((item) => (item.id === contact.id ? contact : item)),
    );
    if (!matchesContact(contact, query, favorites, group)) clearFilters();
    setSelectedId(contact.id);
    setDraft(null);
    requestAnimationFrame(() => detailHeadingRef.current?.focus());
    notify.success(isNew ? "Contact added" : "Contact updated", { description: contact.name });
  }

  function restoreDialogFocus(event: Event) {
    event.preventDefault();
    const trigger = dialogTrigger.current;
    if (trigger?.isConnected && trigger.getClientRects().length) trigger.focus();
    else searchRef.current?.focus();
  }

  function closeForm() {
    setDraft(null);
    requestAnimationFrame(() => {
      const target = draft === "new" ? addRef.current : detailHeadingRef.current;
      if (target?.getClientRects().length) target.focus();
      else searchRef.current?.focus();
    });
  }

  return (
    <>
      <PageHeader
        title="Address book"
        subtitle="Browse and manage sample contacts. Changes reset when you reload."
        actions={
          <Button
            ref={addRef}
            className="dark:bg-primary/80 dark:hover:bg-primary/70"
            disabled={draft !== null}
            onClick={() => setDraft("new")}
          >
            <UserRoundPlus aria-hidden="true" />
            Add contact
          </Button>
        }
      />
      <div className="grid min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:h-[clamp(32rem,calc(100dvh-16rem),46rem)] lg:grid-cols-[minmax(17rem,2fr)_minmax(0,3fr)]">
        <section
          aria-label="Contact directory"
          className={cn(
            "@container flex min-h-0 min-w-0 flex-col border-border lg:border-r",
            (selected || draft) && "hidden lg:flex",
          )}
        >
          <div className="grid shrink-0 gap-3 border-b border-border p-4">
            <InputGroup>
              <InputGroupIcon>
                <Search aria-hidden="true" />
              </InputGroupIcon>
              <InputGroupInput
                ref={searchRef}
                type="search"
                aria-label="Search contacts"
                placeholder="Search contacts…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedId(undefined);
                }}
              />
            </InputGroup>
            <div className="grid gap-2 @min-[15rem]:grid-cols-[minmax(0,1fr)_auto]">
              <NativeSelect
                aria-label="Filter by group"
                value={group}
                onChange={(event) => {
                  setGroup(contactGroups.find((option) => option === event.target.value) ?? "");
                  setSelectedId(undefined);
                }}
              >
                <option value="">All groups</option>
                {contactGroups.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </NativeSelect>
              <Button
                variant={favorites ? "secondary" : "outline"}
                aria-pressed={favorites}
                onClick={() => {
                  setFavorites(!favorites);
                  setSelectedId(undefined);
                }}
              >
                <Star aria-hidden="true" className={favorites ? "fill-current" : undefined} />
                Favorites
              </Button>
            </div>
          </div>
          <p role="status" className="shrink-0 px-4 pt-3 pb-2 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "contact" : "contacts"}
          </p>
          {filtered.length ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 lg:scrollbar-primary">
              {Array.from(grouped, ([initial, people]) => (
                <div key={initial}>
                  <h2 className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                    {initial}
                  </h2>
                  <ul>
                    {people.map((contact) => (
                      <li key={contact.id}>
                        <button
                          id={`address-book-row-${contact.id}`}
                          type="button"
                          disabled={draft !== null}
                          aria-current={contact.id === active?.id ? "true" : undefined}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left outline-none enabled:hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
                            contact.id === active?.id &&
                              "lg:bg-accent lg:text-accent-foreground lg:hover:bg-accent",
                          )}
                          onClick={() => {
                            setSelectedId(contact.id);
                            requestAnimationFrame(() => backRef.current?.focus());
                          }}
                        >
                          <ContactAvatar name={contact.name} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {contact.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {contact.company || contact.role || contact.email || contact.phone}
                            </span>
                          </span>
                          {contact.favorite && (
                            <Star
                              aria-label="Favorite"
                              className="size-3.5 shrink-0 fill-primary text-primary"
                            />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="m-4 px-3 py-6"
              icon={<Search aria-hidden="true" />}
              title={hasFilters ? "No matching contacts" : "No contacts yet"}
              description={
                hasFilters
                  ? "Try another search or clear your filters."
                  : "Use Add contact to start your address book."
              }
              action={
                hasFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearFilters();
                      searchRef.current?.focus();
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          )}
        </section>
        <div
          className={cn(
            "min-h-0 min-w-0 overflow-y-auto",
            !selected && !draft && "hidden lg:block",
          )}
        >
          {draft ? (
            <ContactForm
              key={draft === "new" ? "new" : draft.id}
              draft={draft}
              defaultGroup={group}
              onClose={closeForm}
              onSave={saveContact}
            />
          ) : active ? (
            <ContactDetails
              contact={active}
              backRef={backRef}
              headingRef={detailHeadingRef}
              onBack={() => {
                setSelectedId(undefined);
                requestAnimationFrame(() => {
                  const row = document.getElementById(`address-book-row-${active.id}`);
                  (row ?? searchRef.current)?.focus();
                });
              }}
              onFavorite={() => {
                contactsStore.set((current) =>
                  current.map((contact) =>
                    contact.id === active.id
                      ? { ...contact, favorite: !contact.favorite }
                      : contact,
                  ),
                );
                if (favorites && active.favorite) {
                  setSelectedId(undefined);
                  requestAnimationFrame(() => searchRef.current?.focus());
                }
              }}
              onEdit={() => setDraft(active)}
              onDelete={(button) => {
                dialogTrigger.current = button;
                setDeleting(active);
              }}
            />
          ) : (
            <EmptyState
              className="h-full justify-center border-0"
              icon={<BookUser aria-hidden="true" />}
              title="No contact to display"
            />
          )}
        </div>
      </div>
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
      >
        <AlertDialogContent onCloseAutoFocus={restoreDialogFocus}>
          <AlertDialogHeader className="min-w-0">
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
              {deleting?.name} will be removed from your address book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="dark:bg-destructive/75 dark:hover:bg-destructive/65"
              onClick={() => {
                if (!deleting) return;
                dialogTrigger.current = null;
                contactsStore.set((current) =>
                  current.filter((contact) => contact.id !== deleting.id),
                );
                setSelectedId(undefined);
                setDeleting(undefined);
                notify.success("Contact deleted", { description: deleting.name });
              }}
            >
              Delete contact
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
