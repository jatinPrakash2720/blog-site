// 1. Import all the Tabs components from the raw Shadcn UI file
import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from "@/components/ui/tabs";

// 2. Re-export all the components for use in your application.
const Tabs = ShadcnTabs;
const TabsList = ShadcnTabsList;
const TabsTrigger = ShadcnTabsTrigger;
const TabsContent = ShadcnTabsContent;

export { Tabs, TabsList, TabsTrigger, TabsContent };
