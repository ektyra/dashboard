import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Card } from "../components/card";
import { Illustration } from "./illustration";
import type { IllustrationName } from "./illustration";

type HeroCardProps = Readonly<{
  title: string;
  description: string;
  illustration: IllustrationName;
  /** Buttons or links under the text. */
  actions?: ReactNode;
  className?: string;
}>;

/** A welcome tile: a headline and a call to action, with a soft illustration behind them. */
export function HeroCard({ title, description, illustration, actions, className }: HeroCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <Illustration
        name={illustration}
        className="absolute -top-6 -right-10 h-[125%] w-3/5 min-w-72 object-cover object-right opacity-90"
      />
      <div className="relative grid max-w-md gap-4 p-6 md:p-8">
        <div className="grid gap-2">
          <h2 className="text-2xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
