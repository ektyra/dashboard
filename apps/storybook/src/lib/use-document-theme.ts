import { useEffect, useState } from "react";

/**
 * The current light/dark choice, read from the `dark` class on <html>.
 * Storybook's theme toggle sets that class, so this keeps the toaster in step.
 * (The template's ThemeProvider owns the class in the real app; Storybook does not use it.)
 */
export function useDocumentTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}
