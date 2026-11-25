import { Compass, ServerCrash, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../components/button";

type Kind = "404" | "500" | "maintenance";

const copy: Record<
  Kind,
  { icon: ReactNode; code: string; title: string; text: string; actions: ReactNode }
> = {
  "404": {
    icon: <Compass />,
    code: "404",
    title: "We cannot find that page",
    text: "The link may be old, or the page may have moved. Check the address, or go back to the dashboard.",
    actions: (
      <>
        <Button>Go to the dashboard</Button>
        <Button variant="outline">Go back</Button>
      </>
    ),
  },
  "500": {
    icon: <ServerCrash />,
    code: "500",
    title: "Something went wrong on our side",
    text: "We have been told and are looking into it. Try again in a minute. If it keeps happening, contact support and mention the time.",
    actions: (
      <>
        <Button>Try again</Button>
        <Button variant="outline">Contact support</Button>
      </>
    ),
  },
  maintenance: {
    icon: <Wrench />,
    code: "Maintenance",
    title: "We are making things better",
    text: "The dashboard is offline for a short update. We expect to be back at 14:00. Your data is safe.",
    actions: <Button variant="outline">Check status</Button>,
  },
};

/** A full-page message that says what happened and what to do next, without blaming the user. */
export function ErrorPage({ kind }: Readonly<{ kind: Kind }>) {
  const c = copy[kind];
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center p-6">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <span
          className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl [&_svg]:size-7"
          aria-hidden="true"
        >
          {c.icon}
        </span>
        <p className="text-primary text-sm font-medium tracking-widest uppercase">{c.code}</p>
        <h1 className="text-3xl tracking-tight">{c.title}</h1>
        <p className="text-muted-foreground">{c.text}</p>
        <div className="flex flex-wrap justify-center gap-2">{c.actions}</div>
      </div>
    </main>
  );
}
