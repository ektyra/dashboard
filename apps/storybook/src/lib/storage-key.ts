let prefix = "ektyra";

/**
 * Gives this project its own browser storage names. Without it, every project served from
 * `localhost` shares one theme, sidebar and appearance, because storage is per address, not per
 * port. The app calls this once, on the server and in the browser, with the project's id.
 */
export const setStoragePrefix = (projectId: string) => {
  prefix = `ektyra-${projectId}`;
};

/** The storage key for a setting, such as `theme`, `sidebar` or `appearance`. */
export const storageKey = (name: string) => `${prefix}-${name}`;
