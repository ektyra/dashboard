import type { ReactNode, Ref } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Copy,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Star,
  Trash2,
} from "lucide-react";
import { contactById, contacts, registerChatContact } from "../chat/chat-data";
import { chatActions, chatStore } from "../chat/chat-store";
import { newMessageRequest } from "../mail-store";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { cn } from "../../lib/cn";
import { notify } from "../../toast";
import type { Contact } from "./contact-data";

function initialsFor(name: string) {
  const words = name.split(/\s+/);
  const first = words[0] ?? "";
  const last = words.length > 1 ? (words.at(-1) ?? "") : "";
  return [first, last]
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
}

export function ContactAvatar({ name, large }: Readonly<{ name: string; large?: boolean }>) {
  return (
    <Avatar aria-hidden="true" className={large ? "size-16" : "size-10"}>
      <AvatarFallback className={cn("font-semibold", large && "text-xl")}>
        {initialsFor(name)}
      </AvatarFallback>
    </Avatar>
  );
}

function ContactField({
  icon: Icon,
  label,
  children,
}: Readonly<{ icon: typeof Mail; label: string; children: ReactNode }>) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 py-3 first:pt-0">
      <Icon aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-sm break-words whitespace-pre-line">{children}</dd>
      </div>
    </div>
  );
}

type ContactDetailsProps = Readonly<{
  contact: Contact;
  backRef: Ref<HTMLButtonElement>;
  headingRef: Ref<HTMLHeadingElement>;
  onBack: () => void;
  onFavorite: () => void;
  onEdit: () => void;
  onDelete: (button: HTMLButtonElement) => void;
}>;

export function ContactDetails({
  contact,
  backRef,
  headingRef,
  onBack,
  onFavorite,
  onEdit,
  onDelete,
}: ContactDetailsProps) {
  const { name, role, company, group, email, phone, address, notes, favorite } = contact;
  const linkClass =
    "text-primary underline decoration-current/50 underline-offset-4 hover:decoration-current dark:text-[color-mix(in_oklab,var(--primary)_75%,var(--foreground))]";
  const navigate = useNavigate();
  const directoryChatId = `address-book:${contact.id}`;
  const knownContact =
    contactById(directoryChatId) ??
    (email
      ? contacts.find((entry) => entry.email.toLowerCase() === email.toLowerCase())
      : undefined);
  const chatId = knownContact?.id ?? directoryChatId;
  const hasChat = chatStore.use((state) =>
    state.conversations.some((chat) => chat.contactId === chatId),
  );

  function openChat() {
    if (chatId === directoryChatId) {
      registerChatContact({
        id: chatId,
        name,
        initials: initialsFor(name),
        role: role || "Contact",
        email,
        location: address,
        online: false,
        replies: ["Thanks for the message!", "I'll get back to you soon."],
      });
    }
    if (hasChat) chatActions.open(chatId);
    else chatActions.startChat(chatId);
    void navigate({ to: "/apps/chat" });
  }

  return (
    <section aria-label="Contact details" className="min-w-0">
      <div className="@container border-b border-border bg-muted/40 px-5 pt-4 pb-5 sm:px-6">
        <div className="mb-4 flex justify-between gap-2 lg:justify-end">
          <Button
            ref={backRef}
            variant="ghost"
            size="sm"
            className="px-1.5 lg:hidden"
            onClick={onBack}
          >
            <ArrowLeft aria-hidden="true" />
            Contacts
          </Button>
          <div className="ml-auto flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Favorite"
              aria-pressed={favorite}
              onClick={onFavorite}
            >
              <Star
                aria-hidden="true"
                className={favorite ? "fill-primary text-primary" : "text-muted-foreground"}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete contact"
              onClick={(event) => onDelete(event.currentTarget)}
            >
              <Trash2 aria-hidden="true" className="text-muted-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 @min-[30rem]:flex-row @min-[30rem]:items-center @min-[30rem]:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <ContactAvatar name={name} large />
            <div className="min-w-0">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-2xl leading-tight font-semibold tracking-tight break-words"
              >
                {name}
              </h2>
              {role && <p className="mt-1 text-sm break-words text-muted-foreground">{role}</p>}
              {group && (
                <Badge className="mt-2" variant="secondary">
                  {group}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="px-2.5" onClick={openChat}>
              <MessageSquare aria-hidden="true" />
              {hasChat ? "Open chat" : "Start chat"}
            </Button>
            <Button variant="outline" size="sm" className="px-2.5" onClick={onEdit}>
              <Pencil aria-hidden="true" />
              Edit contact
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 px-5 py-6 sm:px-6">
        <section aria-label="Contact information">
          <h3 className="mb-4 text-base font-semibold">Contact information</h3>
          {email || phone || company || address ? (
            <dl className="divide-y divide-border">
              {email && (
                <ContactField icon={Mail} label="Email">
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      className={cn(linkClass, "min-w-0 cursor-pointer text-left break-all")}
                      onClick={() => {
                        newMessageRequest.set(email);
                        void navigate({ to: "/apps/email" });
                      }}
                    >
                      {email}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      aria-label="Copy email address"
                      title="Copy email address"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(email);
                          notify.success("Email address copied");
                        } catch {
                          notify.error("Could not copy the email address");
                        }
                      }}
                    >
                      <Copy aria-hidden="true" />
                    </Button>
                  </span>
                </ContactField>
              )}
              {phone && (
                <ContactField icon={Phone} label="Phone">
                  <a className={linkClass} href={`tel:${phone.replace(/[\s().-]/g, "")}`}>
                    {phone}
                  </a>
                </ContactField>
              )}
              {company && (
                <ContactField icon={Building2} label="Company">
                  {company}
                </ContactField>
              )}
              {address && (
                <ContactField icon={MapPin} label="Mailing address">
                  {address}
                </ContactField>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">No contact information yet.</p>
          )}
        </section>
        <section aria-label="Notes" className="border-t border-border pt-5">
          <h3 className="mb-2 text-base font-semibold">Notes</h3>
          <p className="max-w-prose text-sm break-words whitespace-pre-wrap text-muted-foreground">
            {notes || "No notes yet."}
          </p>
        </section>
      </div>
    </section>
  );
}
