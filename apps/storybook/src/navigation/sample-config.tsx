import {
  BarChart3,
  CalendarDays,
  Folder,
  House,
  LifeBuoy,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import type { LayoutConfig } from "../shell/config/layout-config";

/** Sample menu used by the Navbar, Sidebar and page template stories. */
export const sampleConfig: LayoutConfig = {
  brand: { name: "Ektyra" },
  navigation: {
    main: [
      {
        items: [
          { label: "Dashboard", icon: House, to: "/" },
          { label: "Reports", icon: BarChart3, to: "/reports" },
          { label: "Calendar", icon: CalendarDays, to: "/calendar", badge: "Soon" },
        ],
      },
      {
        label: "Manage",
        items: [
          { label: "Projects", icon: Folder, to: "/projects" },
          {
            label: "People",
            icon: Users,
            children: [
              { label: "Team", to: "/people/team" },
              { label: "Invitations", to: "/people/invitations" },
            ],
          },
          { label: "Messages", icon: Mail, to: "/messages" },
        ],
      },
    ],
    footer: [
      {
        items: [
          { label: "Settings", icon: Settings, to: "/settings" },
          { label: "Help", icon: LifeBuoy, to: "/help" },
        ],
      },
    ],
    extraPages: [{ label: "Profile", to: "/profile", icon: Users, group: "Account" }],
  },
  useBadgeCount: (to) => (to === "/messages" ? 3 : 0),
  useNotifications: () => ({
    items: [
      {
        id: "1",
        type: "email",
        title: "New message from Ada",
        text: "Can you review the Q3 report?",
        at: new Date(Date.now() - 5 * 60_000),
        read: false,
        count: 1,
        to: "/messages",
        onOpen: () => {},
      },
      {
        id: "2",
        type: "calendar",
        title: "Standup in 15 minutes",
        text: "Team room",
        at: new Date(Date.now() - 60 * 60_000),
        read: false,
        count: 1,
        to: "/calendar",
        onOpen: () => {},
      },
      {
        id: "3",
        type: "system",
        title: "Backup finished",
        text: "All data was backed up.",
        at: new Date(Date.now() - 24 * 60 * 60_000),
        read: true,
        count: 1,
        to: "/settings",
        onOpen: () => {},
      },
    ],
    unread: 2,
    open: () => {},
    markAllRead: () => {},
  }),
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
