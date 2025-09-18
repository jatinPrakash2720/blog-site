// 1. Import all the Sheet components from the raw Shadcn UI file
import {
  Sheet as ShadcnSheet,
//   SheetPortal as ShadcnSheetPortal,
//   SheetOverlay as ShadcnSheetOverlay,
  SheetTrigger as ShadcnSheetTrigger,
  SheetClose as ShadcnSheetClose,
  SheetContent as ShadcnSheetContent,
  SheetHeader as ShadcnSheetHeader,
  SheetFooter as ShadcnSheetFooter,
  SheetTitle as ShadcnSheetTitle,
  SheetDescription as ShadcnSheetDescription,
} from "@/components/ui/sheet";

// 2. Re-export all the components for use in your application.
const Sheet = ShadcnSheet;
// const SheetPortal = ShadcnSheetPortal;
// const SheetOverlay = ShadcnSheetOverlay;
const SheetTrigger = ShadcnSheetTrigger;
const SheetClose = ShadcnSheetClose;
const SheetContent = ShadcnSheetContent;
const SheetHeader = ShadcnSheetHeader;
const SheetFooter = ShadcnSheetFooter;
const SheetTitle = ShadcnSheetTitle;
const SheetDescription = ShadcnSheetDescription;

export {
  Sheet,
//   SheetPortal,
//   SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
