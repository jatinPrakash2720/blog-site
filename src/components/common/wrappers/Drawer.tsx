// 1. Import all the Drawer components from the raw Shadcn UI file
import {
  Drawer as ShadcnDrawer,
  DrawerPortal as ShadcnDrawerPortal,
  DrawerOverlay as ShadcnDrawerOverlay,
  DrawerTrigger as ShadcnDrawerTrigger,
  DrawerClose as ShadcnDrawerClose,
  DrawerContent as ShadcnDrawerContent,
  DrawerHeader as ShadcnDrawerHeader,
  DrawerFooter as ShadcnDrawerFooter,
  DrawerTitle as ShadcnDrawerTitle,
  DrawerDescription as ShadcnDrawerDescription,
} from "@/components/ui/drawer";

// 2. Re-export all the components for use in your application.
const Drawer = ShadcnDrawer;
const DrawerPortal = ShadcnDrawerPortal;
const DrawerOverlay = ShadcnDrawerOverlay;
const DrawerTrigger = ShadcnDrawerTrigger;
const DrawerClose = ShadcnDrawerClose;
const DrawerContent = ShadcnDrawerContent;
const DrawerHeader = ShadcnDrawerHeader;
const DrawerFooter = ShadcnDrawerFooter;
const DrawerTitle = ShadcnDrawerTitle;
const DrawerDescription = ShadcnDrawerDescription;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
