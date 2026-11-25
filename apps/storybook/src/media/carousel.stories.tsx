import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/carousel";

const meta = {
  title: "Media/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

const Slide = ({ i, color }: { i: number; color: string }) => (
  <div
    className={`${color} text-primary-foreground grid aspect-video place-items-center rounded-xl text-3xl font-semibold`}
  >
    {i + 1}
  </div>
);

export const Default: Story = {
  render: () => (
    <Carousel className="mx-auto w-full max-w-md" aria-label="Featured">
      <CarouselContent>
        {colors.map((c, i) => (
          <CarouselItem key={c}>
            <Slide i={i} color={c} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots className="mt-3" />
    </Carousel>
  ),
};

export const MultipleSlides: Story = {
  render: () => (
    <Carousel className="mx-auto w-full max-w-2xl" aria-label="Gallery" opts={{ align: "start" }}>
      <CarouselContent>
        {colors.concat(colors).map((c, i) => (
          <CarouselItem key={i} className="basis-1/3">
            <Slide i={i} color={c} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
