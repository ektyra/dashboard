import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Field, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import {
  Cta,
  ContactForm,
  Faq,
  FeatureRows,
  Features,
  Footer,
  Header,
  Hero,
  LogoStrip,
  Pricing,
  Stats,
  Steps,
  Testimonials,
  wrap,
} from "../pro/landing/sections";
import { EktyraLogo } from "../brand/ektyra-logo";

const meta = {
  title: "Templates/Landing pages (Pro)",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground min-h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Launch: Story = {
  name: "1. Launch (product or app)",
  render: () => (
    <>
      <Header cta="Download" />
      <Hero
        title="The dashboard your clients will actually use"
        text="Start from a template, run the setup wizard and ship in days."
        primary="Start free"
        secondary="See a demo"
        badge="New: dark mode"
      />
      <LogoStrip />
      <Features title="Everything you need" intro="Six reasons teams pick Ektyra." />
      <FeatureRows />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </>
  ),
};

export const Service: Story = {
  name: "2. Service business",
  render: () => (
    <>
      <Header cta="Call us" links={["Services", "How it works", "Contact"]} />
      <Hero
        title="Dashboards built for your business"
        text="Local, friendly and fast. We set it up, you run it."
        primary="Ask for a quote"
        secondary="020 123 4567"
      />
      <Features
        title="What we do"
        items={[
          { icon: <CalendarDays />, title: "Setup", text: "We install and configure everything." },
          { icon: <MapPin />, title: "Migration", text: "We move your data safely." },
          { icon: <CalendarDays />, title: "Support", text: "A real person answers within a day." },
        ]}
      />
      <Steps />
      <Testimonials />
      <section className={`${wrap} grid gap-8 py-16 lg:grid-cols-2`}>
        <ContactForm />
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-2xl tracking-tight">Visit or call</h2>
          <p className="text-muted-foreground">Keizersgracht 1, Amsterdam</p>
          <p className="text-muted-foreground">020 123 4567 · info@example.com</p>
        </div>
      </section>
      <Footer />
    </>
  ),
};

export const Saas: Story = {
  name: "3. SaaS with pricing",
  render: () => (
    <>
      <Header cta="Start" links={["Features", "Pricing", "Docs"]} />
      <Hero
        title="Reports your whole team understands"
        text="Connect your data, pick a chart, share a link."
        primary="Start free trial"
        align="center"
        visual
      />
      <LogoStrip />
      <Stats />
      <Features title="Built to be used" />
      <Pricing />
      <Faq />
      <Cta title="Start your free trial today" button="Start free" />
      <Footer />
    </>
  ),
};

export const Event: Story = {
  name: "4. Event or webinar",
  render: () => (
    <>
      <Header cta="Register" links={["Agenda", "Speakers"]} />
      <Hero
        badge="12 December · Online"
        title="Design systems that scale"
        text="A free two-hour webinar with three practitioners. Live Q&A at the end."
        primary="Register now"
        visual
      />
      <section className={`${wrap} py-12`}>
        <h2 className="mb-6 text-3xl tracking-tight">Agenda</h2>
        <ol className="border-border divide-border divide-y rounded-xl border">
          {[
            ["14:00", "Welcome"],
            ["14:10", "Tokens that survive a rebrand"],
            ["14:50", "Accessibility in practice"],
            ["15:30", "Q&A"],
          ].map(([t, x]) => (
            <li key={t} className="flex gap-6 px-5 py-3 text-sm">
              <span className="text-muted-foreground w-14 tabular-nums">{t}</span>
              {x}
            </li>
          ))}
        </ol>
      </section>
      <section className={`${wrap} py-12`}>
        <h2 className="mb-6 text-3xl tracking-tight">Speakers</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((n) => (
            <li key={n}>
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="bg-primary/10 text-primary grid size-16 place-items-center rounded-full text-lg">
                    {n
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span>{n}</span>
                  <span className="text-muted-foreground text-xs">Design engineer</span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${wrap} max-w-xl py-12`}>
        <ContactForm
          title="Register"
          fields={["Name", "Email", "Questions for the speakers (optional)"]}
        />
      </section>
      <Footer />
    </>
  ),
};

export const LeadCapture: Story = {
  name: "5. Lead capture",
  render: () => (
    <div className="flex min-h-dvh flex-col">
      <header className={`${wrap} py-6`}>
        <EktyraLogo className="h-6 w-auto" />
      </header>
      <main className={`${wrap} grid flex-1 items-center gap-10 py-10 lg:grid-cols-2`}>
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
            Get the free guide to dashboards that people love
          </h1>
          <ul className="flex flex-col gap-3">
            {[
              "12 patterns that cut support questions",
              "A checklist for accessible forms",
              "Real examples with sample data",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="bg-success/15 text-success-text grid size-5 place-items-center rounded-full text-xs">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-6">
            <Field>
              <FieldLabel htmlFor="lc-email">Work email</FieldLabel>
              <Input id="lc-email" type="email" />
            </Field>
            <Button size="lg">Send me the guide</Button>
            <p className="text-muted-foreground text-xs">
              We send the guide and one follow-up. Unsubscribe any time.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  ),
};
