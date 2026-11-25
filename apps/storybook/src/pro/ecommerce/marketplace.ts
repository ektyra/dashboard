import { createStore } from "../../lib/store";

export const sellers = [
  {
    id: "northline",
    name: "Northline Studio",
    owner: "Amina Brooks",
    city: "San Francisco",
    country: "United States",
    email: "amina.brooks@example.com",
    since: 2021,
    specialty: "Studio essentials",
    initials: "N",
  },
  {
    id: "paper-form",
    name: "Paper & Form",
    owner: "Camille Laurent",
    city: "Lyon",
    country: "France",
    email: "camille.laurent@example.com",
    since: 2019,
    specialty: "Paper goods",
    initials: "P",
  },
  {
    id: "fieldwork",
    name: "Fieldwork",
    owner: "Elena Ruiz",
    city: "Valencia",
    country: "Spain",
    email: "elena.ruiz@example.com",
    since: 2023,
    specialty: "Desk accessories",
    initials: "F",
  },
] as const;

export const sellerById = (id?: string) => sellers.find((seller) => seller.id === id);

export const reviewStatuses = ["Pending", "Published", "Hidden"] as const;
export type Review = {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  status: (typeof reviewStatuses)[number];
};

export const reviewsStore = createStore<Review[]>([
  {
    id: "r8",
    productId: "tee",
    customerId: "maya",
    rating: 5,
    title: "My new studio staple",
    text: "The fabric feels substantial and the fit is easy without being boxy.",
    date: "2026-11-18",
    status: "Published",
  },
  {
    id: "r7",
    productId: "notebooks",
    customerId: "noah",
    rating: 5,
    title: "The pages really do lie flat",
    text: "I use one for sketches and one for notes. Both take ink well.",
    date: "2026-11-18",
    status: "Published",
  },
  {
    id: "r6",
    productId: "plant",
    customerId: "noah",
    rating: 4,
    title: "Cheered up my desk",
    text: "Looks great next to my monitor. A care card would make it even better.",
    date: "2026-11-17",
    status: "Published",
  },
  {
    id: "r5",
    productId: "tote",
    customerId: "sven",
    rating: 5,
    title: "Room for a whole workday",
    text: "It fits my laptop, notebooks, and lunch. The handles feel sturdy.",
    date: "2026-11-16",
    status: "Published",
  },
  {
    id: "r4",
    productId: "notebooks",
    customerId: "amina",
    rating: 4,
    title: "Lovely covers",
    text: "The colors are subtle in person. I'd buy a lined version too.",
    date: "2026-11-15",
    status: "Pending",
  },
  {
    id: "r3",
    productId: "stickers",
    customerId: "iris",
    rating: 5,
    title: "Good color and finish",
    text: "They've held up nicely on my water bottle.",
    date: "2026-11-14",
    status: "Published",
  },
  {
    id: "r2",
    productId: "plant",
    customerId: "maya",
    rating: 3,
    title: "Smaller than I expected",
    text: "The planter is well made, but I'd like to see dimensions on the listing.",
    date: "2026-11-14",
    status: "Published",
  },
  {
    id: "r1",
    productId: "tee",
    customerId: "camille",
    rating: 4,
    title: "Good weight",
    text: "A heavier tee than most. It softened after the first wash.",
    date: "2026-11-12",
    status: "Hidden",
  },
]);
