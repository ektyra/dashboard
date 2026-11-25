/**
 * Storybook stand-in for `@ektyra/ui/theme`. In the real app the ThemeProvider owns the
 * `dark` class and remembers the choice; in Storybook the toolbar toggle does, so this
 * only flips the class (enough for the command menu demo).
 */
export type Theme = "light" | "dark" | "system";

export function useTheme() {
  return {
    setTheme: (theme: Theme) => {
      const dark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    },
  };
}
