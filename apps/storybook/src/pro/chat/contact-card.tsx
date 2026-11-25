import { useEffect, useState } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { RoleBadgeText } from "./role-badge-text";
import type { Contact } from "./chat-data";
import { ContactAvatar } from "./contact-avatar";

/** The person's local time, worked out in the browser (the server does not know your clock). */
function useLocalTime(timezone?: string) {
  const [time, setTime] = useState<string>();
  useEffect(() => {
    if (!timezone) return;
    const format = () =>
      new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }).format(new Date());
    setTime(format());
    const timer = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(timer);
  }, [timezone]);
  return time;
}

/** What opens when you click the name at the top of a chat. */
export function ContactCard({ contact }: Readonly<{ contact: Contact }>) {
  const time = useLocalTime(contact.timezone);
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <ContactAvatar contact={contact} className="size-14 text-base" />
        <div className="grid min-w-0 gap-1">
          <p className="truncate">{contact.name}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <RoleBadgeText role={contact.role} />
            <span>{contact.online ? "Online now" : "Offline"}</span>
          </div>
        </div>
      </div>
      {(contact.email || contact.location || contact.timezone) && (
        <ul className="grid gap-2 text-sm">
          {contact.email && (
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="min-w-0 truncate hover:underline">
                {contact.email}
              </a>
            </li>
          )}
          {contact.location && (
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {contact.location}
            </li>
          )}
          {contact.timezone && (
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {time ? `${time} local time` : "Local time"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
