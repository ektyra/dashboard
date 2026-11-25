import { createStore } from "../../lib/store";

export const contactGroups = ["Work", "Clients", "Personal"] as const;
export type ContactGroup = (typeof contactGroups)[number];

export type ContactFields = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  group: ContactGroup | "";
  notes: string;
};

export type Contact = ContactFields & { id: string; favorite: boolean };

export const emptyContact: ContactFields = {
  name: "",
  role: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  group: "",
  notes: "",
};

const sampleContacts: Contact[] = [
  {
    ...emptyContact,
    id: "amina",
    name: "Amina Brooks",
    role: "Studio Director",
    company: "Northline Studio",
    email: "amina.brooks@example.com",
    phone: "+1 (415) 555-0101",
    address: "28 Foundry Lane\nSan Francisco, CA",
    group: "Clients",
    favorite: true,
    notes: "Main contact for the spring catalog. Prefers email for proofs and approvals.",
  },
  {
    ...emptyContact,
    id: "arjun",
    name: "Arjun Mehta",
    role: "Engineering Lead",
    company: "Fieldwork",
    email: "arjun.mehta@example.com",
    phone: "+1 (415) 555-0102",
    group: "Work",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "camille",
    name: "Camille Laurent",
    role: "Art Director",
    company: "Paper & Form",
    email: "camille.laurent@example.com",
    group: "Clients",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "cora",
    name: "Cora Ellis",
    email: "cora.ellis@example.com",
    phone: "+1 (415) 555-0104",
    group: "Personal",
    favorite: true,
    notes: "Send the weekend pottery class dates.",
  },
  {
    ...emptyContact,
    id: "daniel",
    name: "Daniel Park",
    role: "Product Designer",
    company: "Fieldwork",
    email: "daniel.park@example.com",
    group: "Work",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "elena",
    name: "Elena Ruiz",
    role: "Operations Manager",
    company: "Northline Studio",
    email: "elena.ruiz@example.com",
    phone: "+1 (415) 555-0106",
    group: "Clients",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "hana",
    name: "Hana Sato",
    role: "Photographer",
    email: "hana.sato@example.com",
    phone: "+1 (415) 555-0107",
    group: "Work",
    favorite: true,
  },
  {
    ...emptyContact,
    id: "jonah",
    name: "Jonah Reed",
    phone: "+1 (415) 555-0108",
    group: "Personal",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "maya",
    name: "Maya Patel",
    role: "Project Manager",
    company: "Fieldwork",
    email: "maya.patel@example.com",
    group: "Work",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "nadia",
    name: "Nadia Wilson",
    role: "Editor",
    company: "Paper & Form",
    email: "nadia.wilson@example.com",
    group: "Clients",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "riley",
    name: "Riley Park",
    email: "riley@example.com",
    role: "Editor",
    group: "Work",
    favorite: false,
  },
  {
    ...emptyContact,
    id: "samira",
    name: "Samira Haddad",
    role: "Account Manager",
    company: "Morrow Press",
    email: "samira.haddad@example.com",
    phone: "+1 (415) 555-0112",
    group: "Clients",
    favorite: false,
  },
];

export const contactsStore = createStore(sampleContacts);
