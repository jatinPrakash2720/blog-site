// 1. Import all the Carousel components from the raw Shadcn UI file
import {
  Carousel as ShadcnCarousel,
  CarouselContent as ShadcnCarouselContent,
  CarouselItem as ShadcnCarouselItem,
  CarouselPrevious as ShadcnCarouselPrevious,
  CarouselNext as ShadcnCarouselNext,
} from "@/components/ui/carousel";

// 2. Re-export all the components for use in your application.
const Carousel = ShadcnCarousel;
const CarouselContent = ShadcnCarouselContent;
const CarouselItem = ShadcnCarouselItem;
const CarouselPrevious = ShadcnCarouselPrevious;
const CarouselNext = ShadcnCarouselNext;

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
