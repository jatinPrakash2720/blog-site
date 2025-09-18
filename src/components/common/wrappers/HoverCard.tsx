// 1. Import all the HoverCard components from the raw Shadcn UI file
import {
  HoverCard as ShadcnHoverCard,
  HoverCardTrigger as ShadcnHoverCardTrigger,
  HoverCardContent as ShadcnHoverCardContent,
} from "@/components/ui/hover-card";

// 2. Re-export all the components for use in your application.
const HoverCard = ShadcnHoverCard;
const HoverCardTrigger = ShadcnHoverCardTrigger;
const HoverCardContent = ShadcnHoverCardContent;

export { HoverCard, HoverCardTrigger, HoverCardContent };
