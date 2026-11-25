/** Sample conversations for the Chat page. Made-up people and messages. */
export type Contact = {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  location: string;
  /** An IANA time zone, to show the person's local time. */
  timezone?: string;
  online: boolean;
  /** What this person answers when you write to them (this is a demo, not a real chat). */
  replies: string[];
};

export type Message = {
  id: string;
  /** `me` for your own messages, otherwise the contact's id. */
  from: string;
  text: string;
  sentAt: Date;
  /** Who reacted with which emoji: the emoji, then the people (`me` or a contact id). */
  reactions: Record<string, string[]>;
  /** The id of the message this one answers. */
  replyTo?: string;
  /** Passed on from another conversation. */
  forwarded?: boolean;
};

export type Conversation = {
  contactId: string;
  messages: Message[];
  unread: number;
};

export const me = "me";

export const contacts: Contact[] = [
  {
    id: "riley",
    email: "riley@example.com",
    location: "Amsterdam, Netherlands",
    timezone: "Europe/Amsterdam",
    name: "Riley Park",
    role: "Editor",
    online: true,
    initials: "RP",
    replies: [
      "Sounds good, I'll take a look.",
      "Thanks! Can you add it to the board?",
      "Perfect. Let's sync after lunch.",
    ],
  },
  {
    id: "jordan",
    email: "jordan@example.com",
    location: "Berlin, Germany",
    timezone: "Europe/Berlin",
    name: "Jordan Lee",
    role: "Designer",
    online: true,
    initials: "JL",
    replies: ["Nice, I'll update the mockup.", "Do we want this in dark mode too?", "On it!"],
  },
  {
    id: "sam",
    email: "sam@example.com",
    location: "Lisbon, Portugal",
    timezone: "Europe/Lisbon",
    name: "Sam Kowalski",
    role: "Developer",
    online: false,
    initials: "SK",
    replies: [
      "I'll check the logs and get back to you.",
      "Merged. It'll be live after the next deploy.",
      "Can you send me the steps to reproduce?",
    ],
  },
  {
    id: "maya",
    email: "maya@northwind.example",
    location: "London, United Kingdom",
    timezone: "Europe/London",
    name: "Maya Visser",
    role: "Customer",
    online: false,
    initials: "MV",
    replies: [
      "Thank you for the quick answer!",
      "That works for us.",
      "Could you send the invoice again?",
    ],
  },
  {
    id: "casey",
    email: "casey@example.com",
    location: "New York, United States",
    timezone: "America/New_York",
    name: "Casey Morgan",
    role: "Marketing",
    online: true,
    initials: "CM",
    replies: ["Great, I'll schedule the post.", "Can we move the launch to Thursday?", "Love it."],
  },
];

export const contactById = (id: string) => contacts.find((contact) => contact.id === id);

/** Register a contact from another demo before opening their conversation. */
export function registerChatContact(contact: Contact) {
  const index = contacts.findIndex((entry) => entry.id === contact.id);
  if (index === -1) contacts.push(contact);
  else contacts[index] = contact;
}

let counter = 0;
const at = (day: number, time: string) => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return new Date(2026, 10, day, hours, minutes);
};
const msg = (from: string, text: string, day: number, time: string): Message => {
  counter += 1;
  return { id: `m${counter}`, from, text, sentAt: at(day, time), reactions: {} };
};

export const initialConversations: Conversation[] = [
  {
    contactId: "riley",
    unread: 2,
    messages: [
      msg("riley", "Morning! Did you see the new pricing draft?", 17, "09:12"),
      msg(me, "Not yet, sending it over my review after stand-up.", 17, "09:14"),
      msg("riley", "No rush. I mostly want to check the plan names.", 17, "09:15"),
      msg(me, "Plan names look good. “Team” might be clearer than “Pro”.", 18, "10:02"),
      msg("riley", "Agreed. I'll change it and ping you.", 18, "10:20"),
      msg("riley", "Also, the release notes are ready for a read.", 18, "10:21"),
    ],
  },
  {
    contactId: "jordan",
    unread: 0,
    messages: [
      msg("jordan", "The new sign-in page is looking great.", 18, "08:40"),
      msg(me, "Thanks! The right panel was your idea.", 18, "08:44"),
      msg("jordan", "Ha, I just copied the reference. Want me to check light mode?", 18, "08:46"),
    ],
  },
  {
    contactId: "sam",
    unread: 1,
    messages: [
      msg(me, "Search ignores accents. Could you take a look?", 17, "15:30"),
      msg("sam", "Yep, I can reproduce it. Looks like a collation setting.", 17, "16:05"),
      msg("sam", "Fix is in review.", 18, "09:01"),
    ],
  },
  {
    contactId: "maya",
    unread: 0,
    messages: [
      msg("maya", "Hi! How do I add a second language to a page?", 16, "13:20"),
      msg(
        me,
        "Open the page, then use the language switcher at the top and choose “Add translation”.",
        16,
        "13:35",
      ),
      msg("maya", "Found it, thank you!", 16, "13:41"),
    ],
  },
  {
    contactId: "casey",
    unread: 0,
    messages: [msg("casey", "Spring release post is scheduled for Tuesday.", 15, "17:02")],
  },
];

export const lastMessage = (conversation: Conversation) =>
  conversation.messages[conversation.messages.length - 1];
