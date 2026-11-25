import { Moon, Sun } from "lucide-react";
import { IconButton } from "../../components/icon-button";
import { useDocumentTheme } from "../../lib/use-document-theme";
import { useTheme } from "../theme";

/** Flips between light and dark (in Storybook this changes the same class as the toolbar toggle). */
export function AuthThemeToggle() {
  const resolved = useDocumentTheme();
  const { setTheme } = useTheme();
  return (
    <IconButton
      label="Toggle light and dark theme"
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
    >
      <Moon className="dark:hidden" aria-hidden="true" />
      <Sun className="hidden dark:block" aria-hidden="true" />
    </IconButton>
  );
}
