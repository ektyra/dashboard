import { Check, Layers, Quote, Zap, ShieldCheck, Clock } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/accordion";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Field, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";
import { EktyraLogo } from "../../brand/ektyra-logo";
import { cn } from "../../lib/cn";

/** The section library. Layouts are lists of these, so they look related. Content width 72rem. */
const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export function Header({
  cta = "Get started",
  links = ["Product", "Pricing", "About"],
}: {
  cta?: string;
  links?: string[];
}) {
  return (
    <header className="border-border border-b">
      <div className={cn(wrap, "flex h-16 items-center justify-between")}>
        <EktyraLogo className="h-6 w-auto" />
        <nav aria-label="Main" className="text-muted-foreground hidden gap-6 text-sm sm:flex">
          {links.map((l) => (
            <a key={l} href="#" className="hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <Button size="sm">{cta}</Button>
      </div>
    </header>
  );
}

export function Hero({
  title,
  text,
  primary,
  secondary,
  align = "left",
  visual = true,
  badge,
}: {
  title: string;
  text: string;
  primary: string;
  secondary?: string;
  align?: "left" | "center";
  visual?: boolean;
  badge?: string;
}) {
  const center = align === "center";
  return (
    <section
      className={cn(
        wrap,
        "grid gap-10 py-16 sm:py-24",
        !center && visual && "lg:grid-cols-2 lg:items-center",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          center && "mx-auto max-w-3xl items-center text-center",
        )}
      >
        {badge && <Badge variant="secondary">{badge}</Badge>}
        <h1 className="text-4xl leading-[1.1] tracking-tight text-balance sm:text-6xl">{title}</h1>
        <p className="text-muted-foreground max-w-xl text-lg">{text}</p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">{primary}</Button>
          {secondary && (
            <Button size="lg" variant="outline">
              {secondary}
            </Button>
          )}
        </div>
      </div>
      {visual && (
        <div
          className="from-primary/20 via-accent to-card border-border aspect-[4/3] w-full rounded-2xl border bg-gradient-to-br shadow-xl"
          role="img"
          aria-label="Product screenshot"
        />
      )}
    </section>
  );
}

export function LogoStrip({ title = "Trusted by teams at" }: { title?: string }) {
  return (
    <section className={cn(wrap, "py-8")}>
      <p className="text-muted-foreground mb-4 text-center text-sm">{title}</p>
      <ul className="text-muted-foreground/70 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-lg font-semibold">
        {["Acme", "Globex", "Initech", "Umbrella", "Hooli"].map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

export function Features({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items?: { icon: ReactNode; title: string; text: string }[];
}) {
  const list = items ?? [
    {
      icon: <Zap />,
      title: "Fast by default",
      text: "Pages load instantly, even on a slow phone.",
    },
    {
      icon: <ShieldCheck />,
      title: "Secure",
      text: "Roles, audit logs and two-step sign-in out of the box.",
    },
    {
      icon: <Layers />,
      title: "Flexible",
      text: "Compose what you need from small, tested parts.",
    },
    { icon: <Clock />, title: "Saves time", text: "Ship a full dashboard in days, not months." },
    {
      icon: <Check />,
      title: "Accessible",
      text: "WCAG 2.2 AA, keyboard friendly, light and dark.",
    },
    { icon: <Quote />, title: "Plain words", text: "Clear messages that say what to do next." },
  ];
  return (
    <section className={cn(wrap, "py-16")}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl tracking-tight">{title}</h2>
        {intro && <p className="text-muted-foreground mt-3">{intro}</p>}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <li key={f.title}>
            <Card className="h-full">
              <CardContent className="flex flex-col gap-3 p-5">
                <span
                  className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg [&_svg]:size-5"
                  aria-hidden="true"
                >
                  {f.icon}
                </span>
                <h3 className="text-base font-medium">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.text}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeatureRows() {
  const rows = [
    [
      "Build pages from sections",
      "Pick a layout, reorder the sections and fill in the fields. Nothing else to learn.",
    ],
    [
      "Everything in one place",
      "Content, people and settings live together, so nothing gets lost between tools.",
    ],
  ];
  return (
    <section className={cn(wrap, "grid gap-16 py-16")}>
      {rows.map(([t, text], i) => (
        <div key={t} className="grid items-center gap-8 lg:grid-cols-2">
          <div className={cn("flex flex-col gap-3", i % 2 === 1 && "lg:order-2")}>
            <h2 className="text-3xl tracking-tight">{t}</h2>
            <p className="text-muted-foreground">{text}</p>
          </div>
          <div
            className="from-primary/15 to-card border-border aspect-[16/10] rounded-2xl border bg-gradient-to-br"
            role="img"
            aria-label={t}
          />
        </div>
      ))}
    </section>
  );
}

export function Stats() {
  return (
    <section className={cn(wrap, "py-12")}>
      <dl className="grid gap-6 text-center sm:grid-cols-3">
        {[
          ["12k+", "dashboards built"],
          ["99.9%", "uptime"],
          ["4.8/5", "average rating"],
        ].map(([v, l]) => (
          <div key={l}>
            <dt className="text-muted-foreground order-2 text-sm">{l}</dt>
            <dd className="text-4xl tracking-tight">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Steps({ title = "How it works" }: { title?: string }) {
  return (
    <section className={cn(wrap, "py-16")}>
      <h2 className="mb-10 text-center text-3xl tracking-tight">{title}</h2>
      <ol className="grid gap-6 sm:grid-cols-3">
        {[
          ["Tell us what you need", "A short form, two minutes."],
          ["We prepare a plan", "You get a clear quote and timeline."],
          ["We build and hand over", "With training for your team."],
        ].map(([t, x], i) => (
          <li key={t} className="flex flex-col gap-2">
            <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-full text-sm">
              {i + 1}
            </span>
            <h3 className="font-medium">{t}</h3>
            <p className="text-muted-foreground text-sm">{x}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className={cn(wrap, "py-16")}>
      <ul className="grid gap-4 md:grid-cols-3">
        {[
          ["It cut our build time in half.", "Ada Lovelace", "CTO, Acme"],
          ["Finally a dashboard our clients enjoy.", "Grace Hopper", "Founder, Globex"],
          ["The accessibility alone sold us.", "Alan Turing", "Head of Design, Initech"],
        ].map(([q, n, r]) => (
          <li key={n}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-between gap-6 p-5">
                <blockquote className="text-base">“{q}”</blockquote>
                <figcaption className="flex items-center gap-3 text-sm">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {n!
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {n}
                    <span className="text-muted-foreground block text-xs">{r}</span>
                  </span>
                </figcaption>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "€0",
      note: "per month",
      features: ["1 project", "Community support"],
      featured: false,
    },
    {
      name: "Team",
      price: "€49",
      note: "per month",
      features: ["Unlimited projects", "10 people", "Priority support"],
      featured: true,
    },
    {
      name: "Business",
      price: "€149",
      note: "per month",
      features: ["Everything in Team", "SSO and audit log", "Dedicated manager"],
      featured: false,
    },
  ];
  return (
    <section className={cn(wrap, "py-16")}>
      <h2 className="mb-10 text-center text-3xl tracking-tight">Simple pricing</h2>
      <ul className="grid items-stretch gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <li key={p.name}>
            <Card className={cn("h-full", p.featured && "border-primary shadow-lg")}>
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  {p.featured && <Badge>Most popular</Badge>}
                </div>
                <p>
                  <span className="text-4xl tracking-tight">{p.price}</span>{" "}
                  <span className="text-muted-foreground text-sm">{p.note}</span>
                </p>
                <ul className="flex flex-1 flex-col gap-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="text-success size-4" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.featured ? "default" : "outline"}>Choose {p.name}</Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  const items = [
    ["Can I change plans later?", "Yes, any time. The difference is prorated."],
    ["Is there a free trial?", "The Starter plan is free forever. Team has a 14-day trial."],
    ["How do I cancel?", "In Billing, in two clicks. No phone call needed."],
  ];
  return (
    <section className={cn(wrap, "max-w-3xl py-16")}>
      <h2 className="mb-6 text-center text-3xl tracking-tight">Questions</h2>
      <Accordion type="single" collapsible>
        {items.map(([q, a], i) => (
          <AccordionItem key={q} value={`q${i}`}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function ContactForm({
  title = "Ask for a quote",
  fields = ["Name", "Email", "What do you need?"],
}: {
  title?: string;
  fields?: string[];
}) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-6">
        <h2 className="text-xl tracking-tight">{title}</h2>
        {fields.map((f, i) => (
          <Field key={f}>
            <FieldLabel htmlFor={`cf-${f}`}>{f}</FieldLabel>
            {i === fields.length - 1 ? (
              <Textarea id={`cf-${f}`} rows={3} />
            ) : (
              <Input id={`cf-${f}`} type={f === "Email" ? "email" : "text"} />
            )}
          </Field>
        ))}
        <Button>Send</Button>
      </CardContent>
    </Card>
  );
}

export function Cta({
  title = "Ready when you are",
  button = "Get started",
}: {
  title?: string;
  button?: string;
}) {
  return (
    <section className={cn(wrap, "py-12")}>
      <div className="bg-primary text-primary-foreground flex flex-col items-center gap-4 rounded-2xl px-6 py-12 text-center">
        <h2 className="text-3xl tracking-tight">{title}</h2>
        <Button size="lg" variant="secondary">
          {button}
        </Button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-border mt-8 border-t">
      <div
        className={cn(
          wrap,
          "text-muted-foreground flex flex-wrap items-center justify-between gap-4 py-8 text-sm",
        )}
      >
        <EktyraLogo className="text-foreground h-5 w-auto" />
        <nav aria-label="Legal" className="flex gap-4">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <span>© 2026 Ektyra</span>
      </div>
    </footer>
  );
}

export { wrap };
