import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { DashboardCard } from "../../widgets/dashboard-card";

const contacts = [
  { name: "Maya Visser", company: "Northwind", tag: "Customer", initials: "MV" },
  { name: "Noah de Boer", company: "Contoso", tag: "Lead", initials: "NB" },
  { name: "Lena Fischer", company: "Fabrikam", tag: "Lead", initials: "LF" },
  { name: "Tom Bakker", company: "Adventure Works", tag: "Partner", initials: "TB" },
  { name: "Iris Jansen", company: "Tailspin", tag: "Customer", initials: "IJ" },
];

const variant = { Customer: "success", Lead: "info", Partner: "secondary" } as const;

export function RecentContactsCard({ className }: Readonly<{ className?: string }>) {
  return (
    <DashboardCard
      title="New contacts"
      description="Sample contacts."
      className={className}
      action={
        <Button variant="ghost" size="sm">
          View all
        </Button>
      }
    >
      <ul className="grid gap-4">
        {contacts.map((contact) => (
          <li key={contact.name} className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback>{contact.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate">{contact.name}</p>
              <p className="truncate text-xs text-muted-foreground">{contact.company}</p>
            </div>
            <Badge variant={variant[contact.tag as keyof typeof variant]}>{contact.tag}</Badge>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
