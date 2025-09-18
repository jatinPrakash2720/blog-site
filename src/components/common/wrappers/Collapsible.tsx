// 1. Import all the Collapsible components from the raw Shadcn UI file
import {
  Collapsible as ShadcnCollapsible,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
  CollapsibleContent as ShadcnCollapsibleContent,
} from "@/components/ui/collapsible";

// 2. Re-export all the components for use in your application.
const Collapsible = ShadcnCollapsible;
const CollapsibleTrigger = ShadcnCollapsibleTrigger;
const CollapsibleContent = ShadcnCollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
