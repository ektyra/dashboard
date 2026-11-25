let provider: () => string = () => "en";

/**
 * Tells the packages which language the user has chosen. The app calls this once,
 * on the server and in the browser, so dates and numbers format the same way in both.
 */
export const setLocaleProvider = (next: () => string) => {
  provider = next;
};

/** The language of the user, such as "en" or "nl". */
export const currentLocale = () => provider();
