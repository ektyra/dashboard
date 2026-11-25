import { LayoutGrid, Layers, Users } from "lucide-react";

const usps = [
  { icon: Users, title: "Built for teams", text: "Collaborate, review, and publish together." },
  { icon: Layers, title: "Flexible roles", text: "Give each teammate the right level of access." },
  {
    icon: LayoutGrid,
    title: "Multi-site management",
    text: "Run and grow multiple sites from one workspace.",
  },
];

/** Three short selling points under the form, separated by thin lines. */
export function AuthUsps() {
  return (
    <ul className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
      {usps.map(({ icon: Icon, title, text }) => (
        <li key={title} className="grid content-start gap-2 sm:px-4 sm:first:pl-0 sm:last:pr-0">
          <Icon className="size-5 text-primary" aria-hidden="true" />
          <p className="text-sm">{title}</p>
          <p className="text-xs leading-snug text-muted-foreground">{text}</p>
        </li>
      ))}
    </ul>
  );
}
