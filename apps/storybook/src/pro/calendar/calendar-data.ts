/** Sample events for the Calendar page. Made-up, not real appointments. */
export type CategoryId = "meeting" | "content" | "launch" | "personal";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: CategoryId;
  location: string;
  description: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  /** Written out in full so Tailwind can find the classes. */
  chip: string;
  dot: string;
};

export const categories: Category[] = [
  { id: "meeting", label: "Meetings", chip: "border-chart-1 bg-chart-1/15", dot: "bg-chart-1" },
  { id: "content", label: "Content", chip: "border-chart-3 bg-chart-3/15", dot: "bg-chart-3" },
  { id: "launch", label: "Launches", chip: "border-chart-2 bg-chart-2/15", dot: "bg-chart-2" },
  { id: "personal", label: "Personal", chip: "border-chart-5 bg-chart-5/15", dot: "bg-chart-5" },
];

export const categoryById = (id: CategoryId) =>
  categories.find((category) => category.id === id) ?? categories[0]!;

/** The day the sample events are built around, and where the calendar starts. */
export const SAMPLE_TODAY = new Date(2026, 10, 18);

let counter = 0;
const make = (
  title: string,
  category: CategoryId,
  day: number,
  startTime: string,
  endTime: string,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => {
  const [sh = 0, sm = 0] = startTime.split(":").map(Number);
  const [eh = 0, em = 0] = endTime.split(":").map(Number);
  counter += 1;
  return {
    id: `e${counter}`,
    title,
    category,
    start: new Date(2026, 10, day, sh, sm),
    end: new Date(2026, 10, day, eh, em),
    allDay: false,
    location: "",
    description: "",
    ...extra,
  };
};

export const sampleEvents: CalendarEvent[] = [
  make("Team stand-up", "meeting", 16, "09:30", "10:00", { location: "Video call" }),
  make("Content review", "content", 16, "14:00", "15:30"),
  make("Design sync", "meeting", 17, "11:00", "12:00", { location: "Room 2" }),
  make("Team stand-up", "meeting", 18, "09:30", "10:00", { location: "Video call" }),
  make("Write release notes", "content", 18, "10:30", "12:30", {
    description: "Spring release, first draft.",
  }),
  make("Lunch with Riley", "personal", 18, "12:30", "13:30", { location: "Café on the corner" }),
  make("Pricing review", "meeting", 18, "14:00", "15:00", { location: "Room 1" }),
  make("Team stand-up", "meeting", 19, "09:30", "10:00", { location: "Video call" }),
  make("Publish “A better workflow”", "content", 19, "13:00", "13:30"),
  make("Dentist", "personal", 19, "16:00", "17:00"),
  make("Release freeze", "launch", 20, "00:00", "23:59", { allDay: true }),
  make("Team stand-up", "meeting", 20, "09:30", "10:00", { location: "Video call" }),
  make("Spring release", "launch", 24, "10:00", "11:00", { description: "Go live and announce." }),
  make("Team stand-up", "meeting", 23, "09:30", "10:00", { location: "Video call" }),
  make("Retro", "meeting", 25, "15:00", "16:00", { location: "Room 1" }),
  make("Newsletter", "content", 26, "09:00", "10:30"),
  make("Workshop: content models", "meeting", 27, "13:00", "16:00", { location: "Studio" }),
  make("Team dinner", "personal", 27, "19:00", "21:30", { location: "Harbour restaurant" }),
  make("Planning week", "meeting", 30, "00:00", "23:59", { allDay: true }),
  make("Roadmap review", "meeting", 12, "10:00", "11:30"),
  make("Blog post: schemas", "content", 11, "09:00", "11:00"),
  make("Beta launch", "launch", 5, "10:00", "11:00"),
];
