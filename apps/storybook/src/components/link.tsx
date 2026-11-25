import type { ComponentProps } from "react";
import { ExternalLink } from "lucide-react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const linkVariants = cva(
  "rounded-sm underline-offset-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        /** Inside a sentence: always underlined. */
        inline: "text-primary underline hover:text-primary/80",
        /** On its own (menus, footers): underline on hover. */
        standalone: "text-foreground hover:text-primary hover:underline",
        /** Quiet, for secondary links. */
        muted: "text-muted-foreground hover:text-foreground hover:underline",
      },
    },
    defaultVariants: { variant: "inline" },
  },
);

type LinkProps = ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Opens in a new tab with a safe `rel` and an external-link icon. */
    external?: boolean;
  };

export function Link({ variant, external = false, className, children, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        linkVariants({ variant }),
        external && "inline-flex items-center gap-1",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external && (
        <>
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
