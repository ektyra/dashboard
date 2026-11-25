import type { ReactNode } from "react";
import { PageBreadcrumbs, useTrailEntry } from "./page-breadcrumbs";

type PageHeaderProps = Readonly<{
  title: string;
  subtitle?: string;
  /**
   * Page-level actions, such as a "New entry" button or a date range. They sit on
   * the right of the title and drop below it on narrow screens.
   */
  actions?: ReactNode;
  /**
   * For a detail page (one user, one entry): the name of the thing being viewed.
   * It becomes the last breadcrumb, and the menu page before it becomes a link.
   */
  current?: string;
  /** Replaces the icon tile, for example with a person's avatar. Pass `false` for none. */
  leading?: ReactNode | false;
  /** Hide the breadcrumbs, for a page that does not belong in the menu. */
  hideBreadcrumbs?: boolean;
}>;

/**
 * The top of every page: breadcrumbs, an icon tile (taken from the menu), the title
 * (the page's <h1>) with its subtitle, and the actions on the right. A thin line
 * separates it from the content.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  current,
  leading,
  hideBreadcrumbs,
}: PageHeaderProps) {
  const entry = useTrailEntry();
  const Icon = entry?.icon;
  const tile =
    leading === false
      ? null
      : (leading ??
        (Icon && (
          <span className="hidden size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:grid [&_svg]:size-6">
            <Icon aria-hidden="true" />
          </span>
        )));

  return (
    <header className="mb-8 border-b border-border pb-6">
      {!hideBreadcrumbs && <PageBreadcrumbs current={current} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {tile}
          <div className="min-w-0">
            <h1 className="text-3xl leading-tight tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 max-w-3xl text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
