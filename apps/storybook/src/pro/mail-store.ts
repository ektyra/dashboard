import { createStore } from "../lib/store";

/**
 * Storybook stand-in for the email app's store. In the full app, setting this opens the composer
 * with that address; here nothing listens, so the buttons that use it do nothing visible.
 */
export const newMessageRequest = createStore<string | undefined>(undefined);
