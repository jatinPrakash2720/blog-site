// 1. Import all the NavigationMenu components from the raw Shadcn UI file
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuList as ShadcnNavigationMenuList,
  NavigationMenuItem as ShadcnNavigationMenuItem,
  NavigationMenuContent as ShadcnNavigationMenuContent,
  NavigationMenuTrigger as ShadcnNavigationMenuTrigger,
  NavigationMenuLink as ShadcnNavigationMenuLink,
  NavigationMenuIndicator as ShadcnNavigationMenuIndicator,
  NavigationMenuViewport as ShadcnNavigationMenuViewport,
} from "@/components/ui/navigation-menu";

// 2. Re-export all the components for use in your application.
const NavigationMenu = ShadcnNavigationMenu;
const NavigationMenuList = ShadcnNavigationMenuList;
const NavigationMenuItem = ShadcnNavigationMenuItem;
const NavigationMenuContent = ShadcnNavigationMenuContent;
const NavigationMenuTrigger = ShadcnNavigationMenuTrigger;
const NavigationMenuLink = ShadcnNavigationMenuLink;
const NavigationMenuIndicator = ShadcnNavigationMenuIndicator;
const NavigationMenuViewport = ShadcnNavigationMenuViewport;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
