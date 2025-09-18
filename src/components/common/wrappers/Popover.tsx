// 1. Import all the Popover components from the raw Shadcn UI file
import {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
} from "@/components/ui/popover";

// 2. Re-export all the components for use in your application.
const Popover = ShadcnPopover;
const PopoverTrigger = ShadcnPopoverTrigger;
const PopoverContent = ShadcnPopoverContent;

export { Popover, PopoverTrigger, PopoverContent };
