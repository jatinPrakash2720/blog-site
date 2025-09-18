// 1. Import the raw Shadcn Toaster and its hook
import { Toaster as ShadcnToaster } from "@/components/ui/sonner";
import { toast as shadcnToast } from "sonner";

// 2. Re-export the toaster and the toast function for use in your application.
const Toaster = ShadcnToaster;
const toast = shadcnToast;

export { Toaster, toast };
 