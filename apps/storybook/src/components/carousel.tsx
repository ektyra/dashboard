import { createContext, use, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

type CarouselContextValue = {
  viewportRef: UseEmblaCarouselType[0];
  api: UseEmblaCarouselType[1];
  canPrev: boolean;
  canNext: boolean;
  selected: number;
  count: number;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = use(CarouselContext);
  if (!context) throw new Error("Carousel parts must be used inside <Carousel>");
  return context;
}

type CarouselProps = ComponentProps<"div"> & {
  /** Embla options, for example `{ loop: true }`. */
  opts?: Parameters<typeof useEmblaCarousel>[0];
};

export function Carousel({ opts, className, children, ...props }: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", ...opts });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
      setSelected(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api]);

  return (
    <CarouselContext value={{ viewportRef, api, canPrev, canNext, selected, count }}>
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext>
  );
}

export function CarouselContent({ className, ...props }: ComponentProps<"div">) {
  const { viewportRef } = useCarousel();
  // The side margins are the room for the arrows, so they never cover a slide.
  return (
    <div ref={viewportRef} className="mx-11 overflow-hidden">
      <div className={cn("-ml-4 flex", className)} {...props} />
    </div>
  );
}

export function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  );
}

export function CarouselPrevious({ className, ...props }: ComponentProps<typeof Button>) {
  const { api, canPrev } = useCarousel();
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Previous slide"
      disabled={!canPrev}
      onClick={() => api?.scrollPrev()}
      className={cn("absolute top-1/2 left-0 size-8 -translate-y-1/2 rounded-full", className)}
      {...props}
    >
      <ChevronLeft aria-hidden="true" />
    </Button>
  );
}

export function CarouselNext({ className, ...props }: ComponentProps<typeof Button>) {
  const { api, canNext } = useCarousel();
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Next slide"
      disabled={!canNext}
      onClick={() => api?.scrollNext()}
      className={cn("absolute top-1/2 right-0 size-8 -translate-y-1/2 rounded-full", className)}
      {...props}
    >
      <ChevronRight aria-hidden="true" />
    </Button>
  );
}

/** One dot per slide. Click to jump. */
export function CarouselDots({ className, ...props }: ComponentProps<"div">) {
  const { api, count, selected } = useCarousel();
  return (
    <div className={cn("mt-4 flex justify-center gap-2", className)} {...props}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selected}
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "h-2 cursor-pointer rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            index === selected
              ? "w-6 bg-primary"
              : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
          )}
        />
      ))}
    </div>
  );
}
