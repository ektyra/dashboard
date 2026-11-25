import { useToken } from "./use-token";

/** One color token: a chip painted with the real CSS variable and its resolved value. */
export function Swatch({ token, label }: Readonly<{ token: string; label?: string }>) {
  const value = useToken(token);
  return (
    <div className="flex w-40 flex-col gap-2">
      <div
        className="border-border h-16 rounded-md border"
        style={{ background: `var(${token})` }}
        role="img"
        aria-label={`${label ?? token} swatch`}
      />
      <div className="text-xs leading-tight">
        <div className="text-foreground font-medium">{label ?? token}</div>
        <div className="text-muted-foreground font-mono break-all">{value || "…"}</div>
      </div>
    </div>
  );
}

export function SwatchGroup({
  title,
  description,
  tokens,
}: Readonly<{ title: string; description?: string; tokens: readonly string[] }>) {
  return (
    <section className="mb-10">
      <h3 className="text-foreground mb-1 text-lg font-semibold">{title}</h3>
      {description ? <p className="text-muted-foreground mb-4 text-sm">{description}</p> : null}
      <div className="flex flex-wrap gap-4">
        {tokens.map((t) => (
          <Swatch key={t} token={t} label={t.replace("--", "")} />
        ))}
      </div>
    </section>
  );
}
