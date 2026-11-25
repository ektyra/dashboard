import { useState } from "react";
import { Ban, LoaderCircle, RotateCcw, RotateCw, Settings, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../../components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/tooltip";
import {
  PreloaderPreview,
  resetAppearance,
  resetCustomTheme,
  setAppearance,
  setCustomTheme,
  useAppearance,
  useCustomTheme,
} from "../appearance";
import type { Preloader } from "../appearance";
import { setSidebarCollapsed, useSidebarCollapsed } from "../sidebar-state";
import { useTheme } from "../theme";
import { ThemeEditor } from "./theme-editor";
import { ColorSchemeChoice } from "./color-scheme-choice";
import { LayoutWireframe } from "./layout-wireframe";
import { OptionPicker } from "./option-picker";
import { paletteOptions } from "./palette-data";

function Section({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="border-b border-border pb-5 last:border-b-0 last:pb-0">{children}</div>;
}

const Tile = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <span
    aria-hidden="true"
    className="grid aspect-[16/10] place-items-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5"
  >
    {children}
  </span>
);

const preloaderOptions = [
  { value: "none", label: "None", icon: <Ban /> },
  { value: "rotating", label: "Rotating", icon: <RotateCw /> },
  { value: "spinning", label: "Spinning", icon: <LoaderCircle /> },
  { value: "loading", label: "Loading", icon: <Sparkles /> },
] as const satisfies readonly { value: Preloader; label: string; icon: React.ReactNode }[];

/**
 * A floating button that opens a drawer to change the look of the app: layout, color scheme,
 * width, palette, sidebar width and preloader. Every choice applies at once and is remembered.
 */
export function ThemeCustomizer() {
  const appearance = useAppearance();
  const customTheme = useCustomTheme();
  const collapsed = useSidebarCollapsed();
  const reduceMotion = useReducedMotion();
  const { setTheme } = useTheme();
  const [preview, setPreview] = useState<{ kind: Preloader; key: number } | null>(null);
  const horizontal = appearance.layout === "horizontal";

  function reset() {
    resetAppearance();
    setSidebarCollapsed(false);
    setTheme("system");
  }

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <motion.button
              type="button"
              aria-label="Customize theme"
              whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              className="fixed right-5 bottom-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground shadow-lg outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* Turns slowly all the time. */}
              <motion.span
                className="inline-grid"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 14, ease: "linear", repeat: Infinity }}
              >
                <Settings className="size-6" aria-hidden="true" />
              </motion.span>
            </motion.button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Customize theme</TooltipContent>
      </Tooltip>

      <SheetContent className="w-[min(24rem,100vw)] gap-0 p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>Theme customizer</SheetTitle>
          <SheetDescription>Changes apply right away and are remembered.</SheetDescription>
        </SheetHeader>

        <div className="scrollbar-primary grid min-h-0 flex-1 content-start gap-5 overflow-y-auto p-5">
          <Section>
            <OptionPicker
              label="Layout"
              value={appearance.layout}
              onValueChange={(value) => setAppearance("layout", value)}
              options={[
                {
                  value: "vertical",
                  label: "Vertical",
                  preview: <LayoutWireframe layout="vertical" />,
                },
                {
                  value: "horizontal",
                  label: "Horizontal",
                  preview: <LayoutWireframe layout="horizontal" />,
                },
                {
                  value: "detached",
                  label: "Detached",
                  preview: <LayoutWireframe layout="detached" />,
                },
              ]}
            />
          </Section>

          <Section>
            <ColorSchemeChoice />
          </Section>

          <Section>
            <OptionPicker
              label="Layout width"
              value={appearance.width}
              onValueChange={(value) => setAppearance("width", value)}
              options={[
                {
                  value: "fluid",
                  label: "Fluid",
                  preview: <LayoutWireframe layout={appearance.layout} />,
                },
                {
                  value: "boxed",
                  label: "Boxed",
                  preview: <LayoutWireframe layout={appearance.layout} boxed />,
                },
              ]}
            />
          </Section>

          <Section>
            <OptionPicker
              label="Color palette"
              columns={3}
              value={appearance.palette}
              onValueChange={(value) => setAppearance("palette", value)}
              options={paletteOptions.map((palette) => ({
                value: palette.value,
                label: palette.label,
                preview: (
                  <span
                    aria-hidden="true"
                    style={
                      {
                        "--l-bg": palette.light.background,
                        "--l-fg": palette.light.primary,
                        "--d-bg": palette.dark.background,
                        "--d-fg": palette.dark.primary,
                      } as React.CSSProperties
                    }
                    className="grid aspect-[16/10] place-items-center rounded-md border border-border bg-(--l-bg) dark:bg-(--d-bg)"
                  >
                    <span className="size-5 rounded-full bg-(--l-fg) dark:bg-(--d-fg)" />
                  </span>
                ),
              }))}
            />
            {appearance.palette === "custom" && (
              <div className="mt-3">
                <ThemeEditor
                  theme={customTheme}
                  onChange={setCustomTheme}
                  onReset={resetCustomTheme}
                />
              </div>
            )}
          </Section>

          <Section>
            <OptionPicker
              label="Sidebar width"
              description={horizontal ? "The horizontal layout has no sidebar." : undefined}
              value={collapsed ? "icons" : "default"}
              disabled={horizontal}
              onValueChange={(value) => setSidebarCollapsed(value === "icons")}
              options={[
                {
                  value: "default",
                  label: "Default",
                  preview: <LayoutWireframe layout="vertical" />,
                },
                {
                  value: "icons",
                  label: "Icon only",
                  preview: <LayoutWireframe layout="vertical" iconOnly />,
                },
              ]}
            />
          </Section>

          <Section>
            <OptionPicker
              label="Preloader"
              description="Shown while the app loads. Picking one plays a short preview."
              value={appearance.preloader}
              onValueChange={(value) => {
                setAppearance("preloader", value);
                setPreview({ kind: value, key: Date.now() });
              }}
              options={preloaderOptions.map((option) => ({
                value: option.value,
                label: option.label,
                preview: <Tile>{option.icon}</Tile>,
              }))}
            />
          </Section>
        </div>

        <SheetFooter className="border-t border-border p-4">
          <Button variant="outline" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Reset to defaults
          </Button>
        </SheetFooter>
      </SheetContent>
      <PreloaderPreview key={preview?.key} kind={preview?.kind ?? null} />
    </Sheet>
  );
}
