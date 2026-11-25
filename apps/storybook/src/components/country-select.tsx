import { useMemo } from "react";
import { countries, languages } from "../lib/countries";
import { Combobox } from "./combobox";
import type { ComboboxOption } from "./combobox";
import { Flag } from "./flag";

type SelectProps = Readonly<{
  /** A lower-case code: "nl". */
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}>;

/** A searchable country picker with flags. Type a name or a code ("neth", "nl"). */
export function CountrySelect({ placeholder = "Select a country", ...props }: SelectProps) {
  const options = useMemo<ComboboxOption[]>(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        hint: country.code,
        icon: <Flag code={country.code} />,
      })),
    [],
  );
  return (
    <Combobox
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search countries…"
      emptyText="No country found."
      {...props}
    />
  );
}

/** A searchable language picker. Each language shows its own name next to the English one. */
export function LanguageSelect({ placeholder = "Select a language", ...props }: SelectProps) {
  const options = useMemo<ComboboxOption[]>(
    () =>
      languages.map((language) => ({
        value: language.code,
        label:
          language.name === language.native
            ? language.name
            : `${language.name} · ${language.native}`,
        hint: language.code,
        icon: <Flag code={language.flag} />,
      })),
    [],
  );
  return (
    <Combobox
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search languages…"
      emptyText="No language found."
      {...props}
    />
  );
}
