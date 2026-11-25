import type { ReactNode } from "react";

/** The title block at the top of an auth form: an optional icon, a heading and a line of help. */
export function AuthHeading({
  title,
  description,
  icon,
}: Readonly<{ title: string; description: ReactNode; icon?: ReactNode }>) {
  return (
    <div className="grid gap-3">
      {icon && (
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </span>
      )}
      <h1 className="text-3xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
