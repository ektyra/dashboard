import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "../components/avatar";

const meta = { title: "Data Display/Avatar", component: Avatar } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Ektyra" alt="Ektyra" />
      <AvatarFallback>EK</AvatarFallback>
    </Avatar>
  ),
};

export const BrokenImageFallsBack: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/does-not-exist.png" alt="Grace Hopper" />
      <AvatarFallback>GH</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {["size-6", "size-8", "size-10", "size-14"].map((s) => (
        <Avatar key={s} className={s}>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      {["AL", "GH", "LT", "MH", "AT", "BL"].map((i) => (
        <Avatar key={i} className="size-9">
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};
