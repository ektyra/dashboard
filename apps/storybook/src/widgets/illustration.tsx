import { cn } from "../lib/cn";

export type IllustrationName = "mountains" | "hills" | "shapes" | "cubes";

/**
 * A decorative picture that switches between a light and a dark version with
 * the theme. The edges are faded with a mask because the artwork has rough edges.
 * It is hidden from screen readers.
 */
export function Illustration({
  name,
  className,
}: Readonly<{ name: IllustrationName; className?: string }>) {
  const shared =
    "pointer-events-none select-none [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_74%)]";
  return (
    <>
      <img
        src={`/illustrations/${name}-light.webp`}
        alt=""
        aria-hidden="true"
        className={cn(shared, "dark:hidden", className)}
      />
      <img
        src={`/illustrations/${name}-dark.webp`}
        alt=""
        aria-hidden="true"
        className={cn(shared, "hidden dark:block", className)}
      />
    </>
  );
}
