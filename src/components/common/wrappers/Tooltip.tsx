// 1. Import all the Tooltip components from the raw Shadcn UI file
import {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from "@/components/ui/tooltip";

// 2. Re-export all the components for use in your application.
const Tooltip = ShadcnTooltip;
const TooltipTrigger = ShadcnTooltipTrigger;
const TooltipContent = ShadcnTooltipContent;
const TooltipProvider = ShadcnTooltipProvider;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
