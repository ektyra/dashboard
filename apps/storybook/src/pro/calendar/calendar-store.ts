import { createStore } from "../../lib/store";
import { sampleEvents } from "./calendar-data";

/** All calendar events, shared so another page (like Email) can add one. */
export const calendarStore = createStore(sampleEvents);
