import type { Meta, StoryObj } from "@storybook/react-vite";
import { VideoPlayer } from "../components/video-player";

const poster = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="#14141a"/><circle cx="400" cy="225" r="48" fill="#6041ec"/><path d="M386 200l40 25-40 25z" fill="white"/></svg>`,
)}`;

// A short CC0 clip hosted by MDN. Needs network access.
const clip = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const meta = {
  title: "Media/VideoPlayer",
  component: VideoPlayer,
  args: { src: clip, poster, description: "A flower opening in time-lapse" },
  decorators: [
    (Story) => (
      <div className="w-[32rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: { aspectRatio: { control: "select", options: ["16/9", "4/3", "1/1"] } },
} satisfies Meta<typeof VideoPlayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Square: Story = { args: { aspectRatio: "1/1" } };
export const NoPoster: Story = { args: { poster: undefined } };
export const Muted: Story = { args: { muted: true, loop: true } };
