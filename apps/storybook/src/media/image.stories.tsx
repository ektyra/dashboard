import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "../components/image";

// Inline SVGs so the stories work offline.
const svg = (c1: string, c2: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><text x="400" y="235" font-size="40" fill="white" text-anchor="middle" font-family="sans-serif">${label}</text></svg>`,
  )}`;

const sample = svg("#6041ec", "#e07a3c", "Ektyra");

const meta = {
  title: "Media/Image",
  component: Image,
  args: { src: sample, alt: "A purple and orange gradient with the word Ektyra" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    aspectRatio: { control: "select", options: ["16/9", "4/3", "1/1", "3/4"] },
    fit: { control: "inline-radio", options: ["cover", "contain"] },
    rounded: { control: "boolean" },
  },
} satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Square: Story = { args: { aspectRatio: "1/1" } };
export const Contain: Story = { args: { fit: "contain", aspectRatio: "1/1" } };
export const Failed: Story = {
  args: { src: "/does-not-exist.jpg", alt: "Team photo (could not load)" },
};

export const WithCaption: Story = {
  render: (args) => (
    <figure className="flex flex-col gap-2">
      <Image {...args} />
      <figcaption className="text-muted-foreground text-xs">
        The Ektyra gradient, 800 × 450.
      </figcaption>
    </figure>
  ),
};
