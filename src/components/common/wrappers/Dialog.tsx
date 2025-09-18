// 1. Import all the Dialog components from the raw Shadcn UI file
import {
  Dialog as ShadcnDialog,
  DialogPortal as ShadcnDialogPortal,
  DialogOverlay as ShadcnDialogOverlay,
  DialogClose as ShadcnDialogClose,
  DialogTrigger as ShadcnDialogTrigger,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogFooter as ShadcnDialogFooter,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
} from "@/components/ui/dialog";

// 2. Re-export all the components directly for use in your application.
const Dialog = ShadcnDialog;
const DialogPortal = ShadcnDialogPortal;
const DialogOverlay = ShadcnDialogOverlay;
const DialogClose = ShadcnDialogClose;
const DialogTrigger = ShadcnDialogTrigger;
const DialogContent = ShadcnDialogContent;
const DialogHeader = ShadcnDialogHeader;
const DialogFooter = ShadcnDialogFooter;
const DialogTitle = ShadcnDialogTitle;
const DialogDescription = ShadcnDialogDescription;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
