import { Monitor, Moon, Sun } from "lucide-react";
import { isTheme, useTheme } from "../theme";
import type { Theme } from "../theme";
import { OptionPicker } from "./option-picker";
import type { PickerOption } from "./option-picker";

const Swatch = ({ mode }: Readonly<{ mode: "light" | "dark" | "system" }>) => {
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  return (
    <span
      aria-hidden="true"
      className={
        mode === "dark"
          ? "grid aspect-[16/10] place-items-center rounded-md border border-neutral-700 bg-neutral-900 text-neutral-200"
          : mode === "light"
            ? "grid aspect-[16/10] place-items-center rounded-md border border-neutral-200 bg-white text-neutral-700"
            : "grid aspect-[16/10] place-items-center rounded-md border border-neutral-300 bg-gradient-to-r from-white to-neutral-900 text-neutral-500"
      }
    >
      <Icon className="size-5" />
    </span>
  );
};

const options: readonly PickerOption<Theme>[] = [
  { value: "light", label: "Light", preview: <Swatch mode="light" /> },
  { value: "dark", label: "Dark", preview: <Swatch mode="dark" /> },
  { value: "system", label: "System", preview: <Swatch mode="system" /> },
];

/** Light, dark or follow the device. Used by the theme customizer and the preferences page. */
export function ColorSchemeChoice() {
  const { theme, setTheme } = useTheme();
  return (
    <OptionPicker
      label="Color scheme"
      value={theme}
      columns={3}
      options={options}
      onValueChange={(value) => {
        if (isTheme(value)) setTheme(value);
      }}
    />
  );
}
