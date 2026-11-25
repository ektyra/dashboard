import countryData from "flag-icons/country.json";

export type Country = { code: string; name: string };

const collator = new Intl.Collator("en");

/** Every ISO country, sorted by name. Codes are lower case ("nl"), matching the flag files. */
export const countries: Country[] = countryData
  .filter((country) => country.iso)
  .map(({ code, name }) => ({ code, name }))
  .sort((a, b) => collator.compare(a.name, b.name));

export type Language = {
  code: string;
  /** English name. */
  name: string;
  /** The language's own name for itself. */
  native: string;
  /** A flag to hint at the language. A language is not a country, so this is only a hint. */
  flag: string;
};

const languageCodes: [code: string, flag: string][] = [
  ["en", "gb"],
  ["nl", "nl"],
  ["de", "de"],
  ["fr", "fr"],
  ["es", "es"],
  ["it", "it"],
  ["pt", "pt"],
  ["pl", "pl"],
  ["sv", "se"],
  ["da", "dk"],
  ["nb", "no"],
  ["fi", "fi"],
  ["cs", "cz"],
  ["tr", "tr"],
  ["ru", "ru"],
  ["uk", "ua"],
  ["ar", "sa"],
  ["hi", "in"],
  ["zh", "cn"],
  ["ja", "jp"],
  ["ko", "kr"],
];

const english = new Intl.DisplayNames(["en"], { type: "language" });

/** Names come from the browser (Intl), so there is no list of translations to maintain. */
export const languages: Language[] = languageCodes.map(([code, flag]) => {
  const native = new Intl.DisplayNames([code], { type: "language" }).of(code) ?? code;
  return {
    code,
    flag,
    name: english.of(code) ?? code,
    native: native.charAt(0).toLocaleUpperCase(code) + native.slice(1),
  };
});
