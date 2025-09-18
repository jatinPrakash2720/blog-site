// 1. Import all the Accordion components from the raw Shadcn UI file
import {
  Accordion as ShadcnAccordion,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
  AccordionContent as ShadcnAccordionContent,
} from "@/components/ui/accordion";

// 2. Re-export all the components for use in your application.
const Accordion = ShadcnAccordion;
const AccordionItem = ShadcnAccordionItem;
const AccordionTrigger = ShadcnAccordionTrigger;
const AccordionContent = ShadcnAccordionContent;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
