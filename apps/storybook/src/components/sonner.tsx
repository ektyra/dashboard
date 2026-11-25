import type { CSSProperties } from "react";
import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";
import { Toaster as SonnerToaster } from "sonner";
import { TOAST_DURATION } from "../toast";
import { useDocumentTheme } from "../lib/use-document-theme";
import { Spinner } from "./spinner";

type Accent = "success" | "error" | "warning" | "info";

// Each status gets its own accent. Danger uses the theme's `--destructive`.
const accentVariable: Record<Accent, string> = {
  success: "var(--success)",
  error: "var(--destructive)",
  warning: "var(--warning)",
  info: "var(--info)",
};

/**
 * Sonner reads `--<type>-bg`, `--<type>-border` and `--<type>-text` when
 * `richColors` is on. We feed it tinted versions of the theme's accents, so the
 * toasts follow light and dark mode with no hard-coded colors.
 */
const statusStyle = Object.fromEntries(
  (Object.keys(accentVariable) as Accent[]).flatMap((type) => [
    [`--${type}-bg`, `color-mix(in oklab, ${accentVariable[type]} 9%, var(--popover))`],
    [`--${type}-border`, `color-mix(in oklab, ${accentVariable[type]} 35%, var(--border))`],
    [`--${type}-text`, "var(--popover-foreground)"],
  ]),
);

const iconClass = "size-5";

/**
 * App-wide toast host. Mount it once (in the root route); call `toast()` from
 * `sonner` anywhere: `toast.success()`, `toast.error()` (danger),
 * `toast.warning()`, `toast.info()`.
 */
export function Toaster() {
  const theme = useDocumentTheme();
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      richColors
      duration={TOAST_DURATION}
      closeButton
      icons={{
        success: <CircleCheck className={iconClass} style={{ color: accentVariable.success }} />,
        error: <OctagonX className={iconClass} style={{ color: accentVariable.error }} />,
        warning: <TriangleAlert className={iconClass} style={{ color: accentVariable.warning }} />,
        info: <Info className={iconClass} style={{ color: accentVariable.info }} />,
        loading: <Spinner className={`${iconClass} text-muted-foreground`} />,
      }}
      toastOptions={{
        classNames: {
          toast: "shadow-lg! backdrop-blur-sm",
          title: "text-sm!",
          description: "text-muted-foreground!",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...statusStyle,
        } as CSSProperties
      }
    />
  );
}
