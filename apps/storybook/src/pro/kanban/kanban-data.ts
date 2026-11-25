/** A sample board for the Kanban page. Made-up work, not real tasks. */
export type Priority = "Low" | "Medium" | "High";
export type Label = "Design" | "Content" | "Bug" | "Development";

export type Member = { id: string; name: string; initials: string };

export type Card = {
  id: string;
  title: string;
  description: string;
  label: Label;
  priority: Priority;
  assigneeId?: string;
  /** A date as `YYYY-MM-DD`, or nothing. */
  due?: string;
};

export type Column = { id: string; title: string; cardIds: string[] };

export const members: Member[] = [
  { id: "am", name: "Alex Morgan", initials: "AM" },
  { id: "jl", name: "Jordan Lee", initials: "JL" },
  { id: "rp", name: "Riley Park", initials: "RP" },
  { id: "sk", name: "Sam Kowalski", initials: "SK" },
];

export const labels: Label[] = ["Design", "Content", "Bug", "Development"];
export const priorities: Priority[] = ["Low", "Medium", "High"];

export const memberById = (id: string | undefined) => members.find((member) => member.id === id);

export const initialCards: Card[] = [
  {
    id: "c1",
    title: "Plan the spring release",
    description: "Decide what ships and write the announcement outline.",
    label: "Content",
    priority: "High",
    assigneeId: "am",
    due: "2026-11-24",
  },
  {
    id: "c2",
    title: "Redesign the pricing table",
    description: "Three plans, one highlighted. Check dark mode.",
    label: "Design",
    priority: "Medium",
    assigneeId: "jl",
    due: "2026-11-27",
  },
  {
    id: "c3",
    title: "Add alt text to old images",
    description: "Three images are missing it on the health check.",
    label: "Content",
    priority: "Low",
    assigneeId: "rp",
  },
  {
    id: "c4",
    title: "Search ignores accents",
    description: "Searching for “café” finds nothing.",
    label: "Bug",
    priority: "High",
    assigneeId: "sk",
    due: "2026-11-20",
  },
  {
    id: "c5",
    title: "Role permissions API",
    description: "Expose the roles and what they allow.",
    label: "Development",
    priority: "Medium",
    assigneeId: "sk",
    due: "2026-12-02",
  },
  {
    id: "c6",
    title: "Write the migration guide",
    description: "From WordPress, step by step.",
    label: "Content",
    priority: "Medium",
    assigneeId: "am",
    due: "2026-12-05",
  },
  {
    id: "c7",
    title: "Empty states for lists",
    description: "Friendly text and one clear action.",
    label: "Design",
    priority: "Low",
    assigneeId: "jl",
  },
  {
    id: "c8",
    title: "Dark mode chart colors",
    description: "Validate the palette against the dark surface.",
    label: "Design",
    priority: "Medium",
    assigneeId: "jl",
    due: "2026-11-15",
  },
  {
    id: "c9",
    title: "Two-step verification",
    description: "Authenticator app, backup codes.",
    label: "Development",
    priority: "High",
    assigneeId: "sk",
    due: "2026-11-17",
  },
  {
    id: "c10",
    title: "Sign-in page",
    description: "Split screen with the product points.",
    label: "Design",
    priority: "Medium",
    assigneeId: "rp",
  },
  {
    id: "c11",
    title: "Set up the component library",
    description: "Buttons, inputs, tables and more.",
    label: "Development",
    priority: "Medium",
    assigneeId: "am",
  },
];

export const initialColumns: Column[] = [
  { id: "backlog", title: "Backlog", cardIds: ["c1", "c3", "c6"] },
  { id: "progress", title: "In progress", cardIds: ["c2", "c4", "c5"] },
  { id: "review", title: "In review", cardIds: ["c7", "c8"] },
  { id: "done", title: "Done", cardIds: ["c9", "c10", "c11"] },
];
