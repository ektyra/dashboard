import { createContext, use } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { EktyraLogo } from "../../brand/ektyra-logo";
import type { ExtraPage, NavGroup } from "../navigation";
import type { Notification } from "../notifications/notification-types";

export type LogoComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** The words the shell shows. Give getters (or call the translate function inside them) so they follow the language. */
export type LayoutLabels = {
  commandSearch: string;
  commandPlaceholder: string;
  commandPages: string;
  commandTheme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
};

/** What the bell shows. The app decides where the notifications come from. */
export type NotificationsState = {
  items: Notification[];
  unread: number;
  open: (notification: Notification) => void;
  markAllRead: () => void;
};

const noNotifications: NotificationsState = {
  items: [],
  unread: 0,
  open: () => {},
  markAllRead: () => {},
};

export type LayoutConfig = {
  brand: {
    /** Shown to screen readers next to the logo. */
    name: string;
    /** A custom logo. Optional: the Ektyra wordmark is the default. It scales with its size classes and uses `currentColor`. */
    logo?: LogoComponent;
    /** A custom logo as an image, such as `/logo.svg`. Used when there is no `logo` component. */
    logoUrl?: string;
  };
  navigation: {
    /** Main menu, top of the sidebar. */
    main: NavGroup[];
    /** Pinned at the bottom of the sidebar. */
    footer: NavGroup[];
    /** Pages without a menu item that search and breadcrumbs should still know. */
    extraPages?: ExtraPage[];
  };
  /** How many unread things a menu item stands for. Called as a hook, once per menu item. */
  useBadgeCount?: (to: string) => number;
  /** The notifications in the bell. Called as a hook. */
  useNotifications?: () => NotificationsState;
  labels: LayoutLabels;
};

const defaultConfig: LayoutConfig = {
  brand: { name: "Ektyra" },
  navigation: { main: [], footer: [] },
  labels: {
    commandSearch: "Search",
    commandPlaceholder: "Search pages…",
    commandPages: "Pages",
    commandTheme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
  },
};

const LayoutConfigContext = createContext<LayoutConfig>(defaultConfig);

/** Gives the shell its menu, brand and words. Without it the shell works, with an empty menu. */
export function LayoutProvider({
  config,
  children,
}: Readonly<{ config: LayoutConfig; children: ReactNode }>) {
  return <LayoutConfigContext value={config}>{children}</LayoutConfigContext>;
}

export const useLayoutConfig = () => use(LayoutConfigContext);

const noBadges = () => 0;
const useNoNotifications = () => noNotifications;
export const useNotificationsState = () =>
  (use(LayoutConfigContext).useNotifications ?? useNoNotifications)();
export const useBadgeCount = (to: string) =>
  (use(LayoutConfigContext).useBadgeCount ?? noBadges)(to);

/** The brand's logo: the custom one when the config has it, else the Ektyra wordmark. */
export function BrandLogo(props: Readonly<SVGProps<SVGSVGElement>>) {
  const { brand } = useLayoutConfig();
  const Logo = brand.logo;
  if (Logo) return <Logo aria-label={brand.name} {...props} />;
  if (brand.logoUrl) {
    // An image logo: the height comes from the size classes (`h-6 w-auto`), so it scales like the wordmark.
    return (
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className={props.className}
        style={props.style}
        draggable={false}
      />
    );
  }
  return <EktyraLogo aria-label={brand.name} {...props} />;
}
