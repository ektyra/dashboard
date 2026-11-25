import { useDocumentTheme } from "../lib/use-document-theme";

/**
 * Storybook stand-in for `@ektyra/ui/theme`. In the real app the ThemeProvider owns the
 * `dark` class and remembers the choice; in Storybook the toolbar toggle does, so this
 * reads the class and flips it (enough for the command menu and the customizer demos).
 */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

let chosen: Theme = "system";

export function useTheme() {
  const resolvedTheme = useDocumentTheme();
  return {
    // "system" is shown until someone picks; after that the pick is shown.
    theme: chosen === "system" ? ("system" as Theme) : resolvedTheme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      chosen = theme;
      const dark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    },
  };
}
